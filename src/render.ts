import React from 'react';
import { reconciler } from './renderer';
import { TerraformNode } from './types';

export function render(element: React.ReactNode): Promise<string> {
  return new Promise((resolve) => {
    const container = {
      type: 'ROOT',
      children: []
    };

    const root = reconciler.createContainer(
      container,
      0,
      null,
      false,
      null,
      '',
      err => console.error(err),
      null
    );

    reconciler.updateContainer(element, root, null, () => {
      const result = processNodes(container.children);
      resolve(result);
    });
  });
}

function processNodes(nodes: TerraformNode[]): string {
  return nodes
    .map(node => {
      if (node.type === 'terraform') {
        return processNodes(node.children as TerraformNode[]);
      }
      return generateHCL(node);
    })
    .flat()
    .filter(Boolean)
    .join('\n\n');
}

function generateHCL(node: TerraformNode): string {
  switch (node.type) {
    case 'provider':
      return generateProvider(node);
    case 'resource':
      return generateResource(node);
    case 'variable':
      return generateVariable(node);
    case 'output':
      return generateOutput(node);
    default:
      return '';
  }
}

function generateProvider(node: TerraformNode): string {
  const { name, configuration } = node.props;
  return `provider "${name}" {
${Object.entries(configuration)
    .map(([key, value]) => `  ${key} = ${JSON.stringify(value)}`)
    .join('\n')}
}`;
}

function generateResource(node: TerraformNode): string {
  const { type, name, attributes, count, depends_on } = node.props;
  const blocks = [];
  
  if (count !== undefined) {
    blocks.push(`  count = ${count}`);
  }

  if (depends_on?.length) {
    blocks.push(`  depends_on = ${JSON.stringify(depends_on)}`);
  }
  
  const attributeBlocks = Object.entries(attributes)
    .map(([key, value]) => {
      // Handle nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        return `  ${key} = ${generateNestedBlock(value)}`;
      }
      return `  ${key} = ${JSON.stringify(value)}`;
    });

  return `resource "${type}" "${name}" {
${[...blocks, ...attributeBlocks].join('\n')}
}`;
}

function generateNestedBlock(value: any): string {
  if (Array.isArray(value)) {
    return `[${value.map(item => 
      typeof item === 'object' ? generateNestedBlock(item) : JSON.stringify(item)
    ).join(', ')}]`;
  }
  
  return `{${Object.entries(value)
    .map(([k, v]) => `${JSON.stringify(k)}: ${
      typeof v === 'object' && v !== null 
        ? generateNestedBlock(v) 
        : JSON.stringify(v)
    }`)
    .join(', ')}}`;
}

function generateVariable(node: TerraformNode): string {
  const { name, type, default: defaultValue, description } = node.props;
  const blocks = [];
  
  if (type) blocks.push(`  type = ${type}`);
  if (defaultValue !== undefined) blocks.push(`  default = ${JSON.stringify(defaultValue)}`);
  if (description) blocks.push(`  description = ${JSON.stringify(description)}`);

  return `variable "${name}" {
${blocks.join('\n')}
}`;
}

function generateOutput(node: TerraformNode): string {
  const { name, value, description } = node.props;
  const blocks = [`  value = ${JSON.stringify(value)}`];
  
  if (description) {
    blocks.push(`  description = ${JSON.stringify(description)}`);
  }

  return `output "${name}" {
${blocks.join('\n')}
}`;
}

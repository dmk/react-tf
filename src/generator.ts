import { TerraformNode } from './types';

export class HCLGenerator {
  static generateNode(node: TerraformNode): string {
    switch (node.type.toLowerCase()) {
      case 'provider':
        return this.generateProvider(node);
      case 'resource':
        return this.generateResource(node);
      case 'variable':
        return this.generateVariable(node);
      case 'output':
        return this.generateOutput(node);
      case 'module':
        return this.generateModule(node);
      case 'data':
        return this.generateData(node);
      case 'locals':
        return this.generateLocals(node);
      case 'backend':
        return this.generateBackend(node);
      case 'terraform':
        return ''; // Skip terraform wrapper node
      default:
        console.log('Unknown node type:', node.type);
        return '';
    }
  }

  private static formatValue(value: any): string {
    // Handle string interpolation
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
      return value.slice(2, -1); // Remove ${ and }
    }
    
    // Handle nested objects
    if (typeof value === 'object' && value !== null) {
      return this.generateNestedBlock(value);
    }
    
    return JSON.stringify(value);
  }

  private static generateNestedBlock(value: any): string {
    if (Array.isArray(value)) {
      return `[
${value.map(item => `    ${this.formatValue(item)}`).join(',\n')}
  ]`;
    }
    
    if (typeof value === 'object' && value !== null) {
      return `{
${Object.entries(value)
        .map(([k, v]) => `    ${k} = ${this.formatValue(v)}`)
        .join('\n')}
  }`;
    }
    
    return this.formatValue(value);
  }

  private static generateProvider(node: TerraformNode): string {
    const { name, configuration } = node.props;
    return `provider "${name}" {
${Object.entries(configuration)
      .map(([key, value]) => `  ${key} = ${this.formatValue(value)}`)
      .join('\n')}
}`;
  }

  private static generateResource(node: TerraformNode): string {
    const { type, name, attributes, count, depends_on } = node.props;
    const blocks = [];
    
    if (count !== undefined) {
      blocks.push(`  count = ${count}`);
    }

    if (depends_on?.length) {
      blocks.push(`  depends_on = ${JSON.stringify(depends_on)}`);
    }
    
    const attributeBlocks = Object.entries(attributes)
      .map(([key, value]) => `  ${key} = ${this.formatValue(value)}`);

    return `resource "${type}" "${name}" {
${[...blocks, ...attributeBlocks].join('\n')}
}`;
  }

  private static generateData(node: TerraformNode): string {
    const { type, name, attributes } = node.props;
    if (Object.keys(attributes).length === 0) {
      return `data "${type}" "${name}" {}`;
    }
    
    return `data "${type}" "${name}" {
${Object.entries(attributes)
      .map(([key, value]) => `  ${key} = ${this.formatValue(value)}`)
      .join('\n')}
}`;
  }

  private static generateLocals(node: TerraformNode): string {
    const { values } = node.props;
    return `locals {
${Object.entries(values)
      .map(([key, value]) => `  ${key} = ${this.formatValue(value)}`)
      .join('\n')}
}`;
  }

  private static generateVariable(node: TerraformNode): string {
    const { name, type, default: defaultValue, description, sensitive } = node.props;
    const blocks = [];
    
    if (type) blocks.push(`  type = ${type}`);
    if (defaultValue !== undefined) blocks.push(`  default = ${this.formatValue(defaultValue)}`);
    if (description) blocks.push(`  description = ${JSON.stringify(description)}`);
    if (sensitive) blocks.push(`  sensitive = true`);

    return `variable "${name}" {
${blocks.join('\n')}
}`;
  }

  private static generateOutput(node: TerraformNode): string {
    const { name, value, description, sensitive, depends_on } = node.props;
    const blocks = [];

    blocks.push(`  value = ${this.formatValue(value)}`);
    if (description) blocks.push(`  description = ${JSON.stringify(description)}`);
    if (sensitive) blocks.push(`  sensitive = true`);
    if (depends_on?.length) blocks.push(`  depends_on = ${JSON.stringify(depends_on)}`);

    return `output "${name}" {
${blocks.join('\n')}
}`;
  }

  private static generateModule(node: TerraformNode): string {
    const { name, source, version, providers, variables } = node.props;
    const blocks = [`  source = ${JSON.stringify(source)}`];
    
    if (version) blocks.push(`  version = ${JSON.stringify(version)}`);
    if (providers) {
      Object.entries(providers).forEach(([key, value]) => {
        blocks.push(`  providers = ${this.formatValue({ [key]: value })}`);
      });
    }
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        blocks.push(`  ${key} = ${this.formatValue(value)}`);
      });
    }

    return `module "${name}" {
${blocks.join('\n')}
}`;
  }

  private static generateBackend(node: TerraformNode): string {
    const { type, configuration } = node.props;
    return `backend "${type}" {
${Object.entries(configuration)
      .map(([key, value]) => `  ${key} = ${this.formatValue(value)}`)
      .join('\n')}
}`;
  }
}

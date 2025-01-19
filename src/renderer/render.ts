import React from 'react';
import { reconciler } from './reconciler';
import { TerraformNode } from './types';
import { HCLGenerator } from './generator';

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
      return HCLGenerator.generateNode(node);
    })
    .flat()
    .filter(Boolean)
    .join('\n\n');
}

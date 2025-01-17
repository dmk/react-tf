import { TerraformNode } from './types';

export class HCLGenerator {
  static generateNode(node: TerraformNode): string {
    switch (node.type) {
      case 'Provider':
        return this.generateProvider(node);
      case 'Resource':
        return this.generateResource(node);
      case 'Variable':
        return this.generateVariable(node);
      case 'Output':
        return this.generateOutput(node);
      default:
        console.log('Unknown node type:', node.type);
        return '';
    }
  }

  private static generateProvider(node: TerraformNode): string {
    const { name, configuration } = node.props;
    return `provider "${name}" {
  ${Object.entries(configuration)
    .map(([key, value]) => `  ${key} = ${JSON.stringify(value)}`)
    .join('\n')}
}`;
  }

  private static generateResource(node: TerraformNode): string {
    const { type, name, attributes, depends_on, count, for_each } = node.props;
    const blocks: string[] = [];

    if (count !== undefined) {
      blocks.push(`  count = ${count}`);
    }

    if (for_each !== undefined) {
      blocks.push(`  for_each = ${JSON.stringify(for_each)}`);
    }

    if (depends_on?.length) {
      blocks.push(`  depends_on = ${JSON.stringify(depends_on)}`);
    }

    const attributeBlocks = Object.entries(attributes)
      .map(([key, value]) => `  ${key} = ${JSON.stringify(value)}`);

    return `resource "${type}" "${name}" {
${[...blocks, ...attributeBlocks].join('\n')}
}`;
  }

  private static generateVariable(node: TerraformNode): string {
    const { name, type, default: defaultValue, description, sensitive } = node.props;
    const blocks: string[] = [];

    if (type) blocks.push(`  type = ${type}`);
    if (defaultValue !== undefined) blocks.push(`  default = ${JSON.stringify(defaultValue)}`);
    if (description) blocks.push(`  description = ${JSON.stringify(description)}`);
    if (sensitive) blocks.push(`  sensitive = true`);

    return `variable "${name}" {
${blocks.join('\n')}
}`;
  }

  private static generateOutput(node: TerraformNode): string {
    const { name, value, description, sensitive, depends_on } = node.props;
    const blocks: string[] = [];

    blocks.push(`  value = ${JSON.stringify(value)}`);
    if (description) blocks.push(`  description = ${JSON.stringify(description)}`);
    if (sensitive) blocks.push(`  sensitive = true`);
    if (depends_on?.length) blocks.push(`  depends_on = ${JSON.stringify(depends_on)}`);

    return `output "${name}" {
${blocks.join('\n')}
}`;
  }
}

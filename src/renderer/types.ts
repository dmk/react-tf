export interface TerraformNode {
  type: string;
  props: Record<string, any>;
  children?: TerraformNode[];
}

export type Container = {
  type: 'ROOT';
  children: TerraformNode[];
};

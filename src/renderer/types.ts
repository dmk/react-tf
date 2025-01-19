export interface TerraformBlockConfig {
  backend?: {
    type: string;
    configuration: Record<string, any>;
  };
  required_version?: string;
  required_providers?: Record<string, {
    source: string;
    version?: string;
  }>;
  experiments?: string[];
}

interface Provider {
  source: string;
  version?: string;
}

export interface TerraformNode {
  type: string;
  props: Record<string, any>;
  children?: TerraformNode[];
  required_providers?: Record<string, Provider>;
}

export type Container = {
  type: 'ROOT';
  children: TerraformNode[];
};

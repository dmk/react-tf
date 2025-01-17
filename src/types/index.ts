export interface TerraformNode {
  type: string;
  props: Record<string, any>;
  children?: TerraformNode[];
}

// Provider types
export interface ProviderConfiguration {
  region?: string;
  access_key?: string;
  secret_key?: string;
  [key: string]: any;
}

export interface ProviderProps {
  name: string;
  configuration: ProviderConfiguration;
}

// Resource types
export interface ResourceProps {
  type: string;
  name: string;
  attributes: Record<string, any>;
  depends_on?: string[];
  count?: number;
  for_each?: string[] | Record<string, any>;
}

// Variable types
export interface VariableProps {
  name: string;
  type?: 'string' | 'number' | 'bool' | 'list' | 'map' | 'object';
  default?: any;
  description?: string;
  sensitive?: boolean;
}

// Output types
export interface OutputProps {
  name: string;
  value: any;
  description?: string;
  sensitive?: boolean;
  depends_on?: string[];
}

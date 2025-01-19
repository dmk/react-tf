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

// Module types
export interface ModuleProps {
  name: string;
  source: string;
  version?: string;
  providers?: Record<string, string>;
  variables?: Record<string, any>;
  depends_on?: string[];
  count?: number;
  for_each?: string[] | Record<string, any>;
}

// Data source types
export interface DataProps {
  type: string;
  name: string;
  attributes: Record<string, any>;
  depends_on?: string[];
  count?: number;
  for_each?: string[] | Record<string, any>;
}

// Locals types
export interface LocalsProps {
  values: Record<string, any>;
}

export interface TerraformBlockProps {
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

// Update the Terraform component props
export interface TerraformProps {
  children: React.ReactNode;
  configuration?: TerraformBlockProps;
}

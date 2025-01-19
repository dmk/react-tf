import { ReactNode } from 'react';
import { 
  ProviderProps, 
  ResourceProps, 
  VariableProps, 
  OutputProps, 
  ModuleProps, 
  DataProps, 
  LocalsProps,
  TerraformBlockProps 
} from './components/types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      terraform: { children: ReactNode; configuration?: TerraformBlockProps };
      provider: ProviderProps;
      resource: ResourceProps;
      variable: VariableProps;
      output: OutputProps;
      module: ModuleProps;
      data: DataProps;
      locals: LocalsProps;
    }
  }
} 
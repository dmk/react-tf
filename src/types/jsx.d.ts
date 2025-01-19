import { ReactNode } from 'react';
import { ProviderProps, ResourceProps, VariableProps, OutputProps, ModuleProps, DataProps, LocalsProps, BackendProps } from '.';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      terraform: { children: ReactNode };
      provider: ProviderProps;
      resource: ResourceProps;
      variable: VariableProps;
      output: OutputProps;
      module: ModuleProps;
      data: DataProps;
      locals: LocalsProps;
      backend: BackendProps;
    }
  }
} 
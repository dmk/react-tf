import { ReactNode } from 'react';
import { ProviderProps, ResourceProps, VariableProps, OutputProps } from '.';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      terraform: { children: ReactNode };
      provider: ProviderProps;
      resource: ResourceProps;
      variable: VariableProps;
      output: OutputProps;
    }
  }
} 
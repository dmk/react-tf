import React from 'react';
import { ProviderProps, ResourceProps, VariableProps, OutputProps } from './types';

export const Terraform = ({ children }: { children: React.ReactNode }) => {
  return <terraform>{children}</terraform>;
};

export const Provider = React.forwardRef<any, ProviderProps>((props, ref) => {
  return <provider {...props} />;
});

export const Resource = React.forwardRef<any, ResourceProps>((props, ref) => {
  return <resource {...props} />;
});

export const Variable = React.forwardRef<any, VariableProps>((props, ref) => {
  return <variable {...props} />;
});

export const Output = React.forwardRef<any, OutputProps>((props, ref) => {
  return <output {...props} />;
});

// Set display names for debugging
Provider.displayName = 'Provider';
Resource.displayName = 'Resource';
Variable.displayName = 'Variable';
Output.displayName = 'Output';

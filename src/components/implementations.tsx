import React from 'react';
import type { 
  ProviderProps,
  ResourceProps,
  VariableProps,
  OutputProps,
  ModuleProps,
  DataProps,
  LocalsProps,
  TerraformProps,
} from './types';

export const Terraform = React.forwardRef<any, TerraformProps>(({ children, configuration }, ref) => {
  return <terraform configuration={configuration}>{children}</terraform>;
});

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

export const Module = React.forwardRef<any, ModuleProps>((props, ref) => {
  return <module {...props} />;
});

export const Data = React.forwardRef<any, DataProps>((props, ref) => {
  return <data {...props} ref={ref} />;
});

export const Locals = React.forwardRef<any, LocalsProps>((props, ref) => {
  return <locals {...props} />;
});

// Set display names for debugging
Terraform.displayName = 'Terraform';
Provider.displayName = 'Provider';
Resource.displayName = 'Resource';
Variable.displayName = 'Variable';
Output.displayName = 'Output';
Module.displayName = 'Module';
Data.displayName = 'Data';
Locals.displayName = 'Locals';

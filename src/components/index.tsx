import React from 'react';
import type { 
  ProviderProps,
  ResourceProps,
  VariableProps,
  OutputProps,
  ModuleProps,
  DataProps,
  LocalsProps,
  BackendProps,
} from './types';

export function Terraform({ children }: { children: React.ReactNode }) {
  return children;
}

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

export const Backend = React.forwardRef<any, BackendProps>((props, ref) => {
  return <backend {...props} />;
});

// Set display names for debugging
Provider.displayName = 'Provider';
Resource.displayName = 'Resource';
Variable.displayName = 'Variable';
Output.displayName = 'Output';
Module.displayName = 'Module';
Data.displayName = 'Data';
Locals.displayName = 'Locals';
Backend.displayName = 'Backend';

// Re-export all types
export type {
  ProviderProps,
  ProviderConfiguration,
  ResourceProps,
  VariableProps,
  OutputProps,
  ModuleProps,
  DataProps,
  LocalsProps,
  BackendProps,
} from './types';

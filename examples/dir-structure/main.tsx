import React from 'react';
import { Provider, Terraform } from '@dkkoval/react-tf';

export default function TerraformConfig() {
  return (
    <>
      <Terraform configuration={{
        required_version: ">= 1.2.0",
        required_providers: {
          aws: {
            source: "hashicorp/aws",
            version: "~> 5.0"
          }
        },
        backend: {
          type: "local",
          configuration: {
            path: "./terraform.tfstate"
          }
        }
      }} />

      <Provider 
        name="aws" 
        configuration={{
          region: "us-west-2",
          default_tags: {
            Project: "example-infrastructure",
            ManagedBy: "terraform"
          }
        }}
      />
    </>
  );
}

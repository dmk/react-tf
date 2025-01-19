import { expect, test, describe } from "bun:test";
import React from 'react';
import { render } from '@/render';
import { Provider, Resource, Variable, Output } from '@/components';

describe('Basic Component Rendering', () => {
  test('renders a provider', async () => {
    const result = await render(
      <Provider 
        name="aws" 
        configuration={{
          region: "us-west-2"
        }}
      />
    );

    expect(result).toContain('provider "aws"');
    expect(result).toContain('region = "us-west-2"');
  });

  test('renders a resource', async () => {
    const result = await render(
      <Resource
        type="aws_instance"
        name="example"
        attributes={{
          ami: "ami-123",
          instance_type: "t2.micro"
        }}
      />
    );

    expect(result).toContain('resource "aws_instance" "example"');
    expect(result).toContain('ami = "ami-123"');
    expect(result).toContain('instance_type = "t2.micro"');
  });

  test('renders a variable', async () => {
    const result = await render(
      <Variable
        name="environment"
        type="string"
        default="dev"
        description="Environment name"
      />
    );

    expect(result).toContain('variable "environment"');
    expect(result).toContain('type = string');
    expect(result).toContain('default = "dev"');
    expect(result).toContain('description = "Environment name"');
  });

  test('renders an output', async () => {
    const result = await render(
      <Output
        name="instance_ip"
        value="${aws_instance.example.public_ip}"
        description="Public IP of the instance"
      />
    );

    expect(result).toContain('output "instance_ip"');
    expect(result).toContain('value = aws_instance.example.public_ip');
    expect(result).toContain('description = "Public IP of the instance"');
  });
}); 
import { expect, test, describe } from "bun:test";
import React from 'react';
import { render } from '@/renderer';
import { Terraform, Provider, Resource, Variable, Output } from '@/components';

describe('Integration Tests', () => {
  test('renders a complete infrastructure', async () => {
    const result = await render(
      <Terraform>
        <Provider 
          name="aws" 
          configuration={{
            region: "us-west-2"
          }}
        />
        <Variable
          name="instance_type"
          type="string"
          default="t2.micro"
        />
        <Resource
          type="aws_instance"
          name="example"
          attributes={{
            ami: "ami-123",
            instance_type: "${var.instance_type}"
          }}
        />
        <Output
          name="public_ip"
          value="${aws_instance.example.public_ip}"
        />
      </Terraform>
    );

    expect(result).toContain('provider "aws"');
    expect(result).toContain('variable "instance_type"');
    expect(result).toContain('resource "aws_instance" "example"');
    expect(result).toContain('output "public_ip"');
    expect(result).toContain('instance_type = var.instance_type');
  });

  test('handles conditional rendering', async () => {
    const isProd = true;
    const result = await render(
      <Terraform>
        <Provider name="aws" configuration={{ region: "us-west-2" }} />
        {isProd && (
          <Resource
            type="aws_cloudwatch_metric_alarm"
            name="high_cpu"
            attributes={{
              comparison_operator: "GreaterThanThreshold",
              threshold: 80
            }}
          />
        )}
      </Terraform>
    );

    expect(result).toContain('provider "aws"');
    expect(result).toContain('resource "aws_cloudwatch_metric_alarm" "high_cpu"');
  });

  test('handles array mapping', async () => {
    const environments = ['dev', 'staging', 'prod'];
    const result = await render(
      <Terraform>
        {environments.map(env => (
          <Resource
            key={env}
            type="aws_instance"
            name={`web_${env}`}
            attributes={{
              instance_type: env === 'prod' ? 't2.medium' : 't2.micro'
            }}
          />
        ))}
      </Terraform>
    );

    expect(result).toContain('resource "aws_instance" "web_dev"');
    expect(result).toContain('resource "aws_instance" "web_staging"');
    expect(result).toContain('resource "aws_instance" "web_prod"');
    expect(result).toContain('instance_type = "t2.medium"');
  });
}); 
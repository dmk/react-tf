import { expect, test, describe } from "bun:test";
import React from 'react';
import { render } from '@/renderer';
import { Terraform, Resource } from '@/components';

describe('Component Composition', () => {
  const VPCResource = ({ cidr }: { cidr: string }) => (
    <Resource
      type="aws_vpc"
      name="main"
      attributes={{ cidr_block: cidr }}
    />
  );

  test('renders custom components', async () => {
    const result = await render(
      <Terraform>
        <VPCResource cidr="10.0.0.0/16" />
      </Terraform>
    );

    expect(result).toContain('resource "aws_vpc" "main"');
    expect(result).toContain('cidr_block = "10.0.0.0/16"');
  });

  test('handles nested components', async () => {
    const result = await render(
      <Terraform>
        <Resource
          type="aws_vpc"
          name="main"
          attributes={{
            cidr_block: "10.0.0.0/16"
          }}
        />
        <Resource
          type="aws_subnet"
          name="main"
          attributes={{
            vpc_id: "${aws_vpc.main.id}",
            cidr_block: "10.0.1.0/24"
          }}
        />
      </Terraform>
    );

    expect(result).toContain('resource "aws_vpc"');
    expect(result).toContain('resource "aws_subnet"');
    expect(result).toContain('vpc_id = aws_vpc.main.id');
  });
}); 
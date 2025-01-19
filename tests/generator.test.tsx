import { expect, test, describe } from "bun:test";
import React from 'react';
import { render } from '@/renderer';
import { Resource } from '@/components';

describe('HCL Generation', () => {
  test('generates correct string interpolation', async () => {
    const result = await render(
      <Resource
        type="aws_instance"
        name="web"
        attributes={{
          instance_type: "${var.instance_type}",
          subnet_id: "${aws_subnet.main.id}"
        }}
      />
    );

    expect(result).toContain('instance_type = var.instance_type');
    expect(result).toContain('subnet_id = aws_subnet.main.id');
  });

  test('handles complex nested attributes', async () => {
    const result = await render(
      <Resource
        type="aws_autoscaling_group"
        name="web"
        attributes={{
          launch_template: {
            id: "${aws_launch_template.web.id}",
            version: "$Latest"
          },
          tags: [
            {
              key: "Environment",
              value: "prod",
              propagate_at_launch: true
            },
            {
              key: "Type",
              value: "web",
              propagate_at_launch: true
            }
          ]
        }}
      />
    );

    expect(result).toContain('launch_template = {');
    expect(result).toContain('id = aws_launch_template.web.id');
    expect(result).toContain('version = "$Latest"');
  });

  test('handles special meta-arguments', async () => {
    const result = await render(
      <Resource
        type="aws_instance"
        name="web"
        count={3}
        depends_on={["aws_vpc.main"]}
        attributes={{
          instance_type: "t2.micro"
        }}
      />
    );

    expect(result).toContain('count = 3');
    expect(result).toContain('depends_on = ["aws_vpc.main"]');
  });
});
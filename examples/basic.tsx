import React from 'react';
import { Terraform, Provider, Resource, render } from '../src';

const BasicInfrastructure = () => (
  <Terraform>
    <Provider
      name="aws"
      configuration={{
        region: "us-west-2"
      }}
    />
    <Resource
      type="aws_instance"
      name="example"
      attributes={{
        ami: "ami-0c55b159cbfafe1f0",
        instance_type: "t2.micro"
      }}
    />
  </Terraform>
);

console.log(await render(<BasicInfrastructure />));

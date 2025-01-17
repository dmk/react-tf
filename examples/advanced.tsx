// Advanced example showing variables, multiple instances, and outputs

import React from 'react';
import { 
  Terraform, 
  Provider, 
  Resource, 
  Variable, 
  Output,
  render
} from '../src';

const AdvancedInfrastructure = () => (
  <Terraform>
    <Provider 
      name="aws" 
      configuration={{
        region: "us-west-2",
        profile: "default"
      }} 
    />
    
    <Variable
      name="instance_type"
      type="string"
      default="t2.micro"
      description="EC2 instance type"
    />

    <Variable
      name="environment"
      type="string"
      default="dev"
      description="Environment name"
    />

    <Resource
      type="aws_instance"
      name="web"
      attributes={{
        ami: "ami-0c55b159cbfafe1f0",
        instance_type: "${var.instance_type}",
        tags: {
          Name: "WebServer",
          Environment: "${var.environment}"
        }
      }}
      count={2}
    />

    <Output
      name="public_ips"
      value="${aws_instance.web[*].public_ip}"
      description="Public IPs of web instances"
    />
  </Terraform>
);

console.log(await render(<AdvancedInfrastructure />));

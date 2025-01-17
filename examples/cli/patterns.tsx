// Example showing React composition patterns for infrastructure 

import React from 'react';
import { 
  Terraform, 
  Provider, 
  Resource, 
  Variable, 
  Output,
} from '../../src';

// Type-safe instance configuration
interface EC2Config {
  instanceType: string;
  name: string;
  environment: string;
  tags?: Record<string, string>;
}

// Reusable component for EC2 instances with consistent configuration
const EC2Instance: React.FC<EC2Config> = ({ 
  instanceType, 
  name, 
  environment, 
  tags = {} 
}) => (
  <Resource
    type="aws_instance"
    name={name}
    attributes={{
      ami: "ami-0c55b159cbfafe1f0",
      instance_type: instanceType,
      tags: {
        Name: name,
        Environment: environment,
        ManagedBy: "terraform-jsx",
        ...tags
      }
    }}
  />
);

// Example of using array mapping and conditional rendering
const WebTier = () => {
  const environments = ['dev', 'staging', 'prod'];
  const instanceTypes = {
    dev: 't2.micro',
    staging: 't2.medium',
    prod: 't2.large'
  };

  return (
    <>
      {environments.map(env => (
        <EC2Instance
          key={env}
          name={`web-${env}`}
          environment={env}
          instanceType={instanceTypes[env as keyof typeof instanceTypes]}
          tags={{
            Role: 'web',
            CostCenter: env === 'prod' ? 'prod-apps' : 'development'
          }}
        />
      ))}
    </>
  );
};

// Example of conditional resource creation
const MonitoringSetup: React.FC<{ environment: string }> = ({ environment }) => (
  environment === 'prod' ? (
    <Resource
      type="aws_cloudwatch_metric_alarm"
      name="high_cpu"
      attributes={{
        comparison_operator: "GreaterThanThreshold",
        evaluation_periods: 2,
        metric_name: "CPUUtilization",
        namespace: "AWS/EC2",
        period: 120,
        statistic: "Average",
        threshold: 80,
        alarm_description: "This metric monitors EC2 CPU utilization"
      }}
    />
  ) : null
);

const PracticalInfrastructure = () => {
  const isProd = process.env.TF_ENV === 'prod';

  return (
    <Terraform>
      <Provider 
        name="aws" 
        configuration={{
          region: "us-west-2",
          profile: isProd ? "production" : "default",
          default_tags: {
            Project: "TerraformJSX",
            Owner: "Platform Team"
          }
        }} 
      />

      <Variable
        name="environment"
        type="string"
        default="dev"
        description="Environment name"
      />

      {/* Reusable component with different configs */}
      <WebTier />

      {/* Conditional resource creation */}
      <MonitoringSetup environment="${var.environment}" />

      {/* Dynamic VPC CIDR based on environment */}
      <Resource
        type="aws_vpc"
        name="main"
        attributes={{
          cidr_block: isProd ? "10.0.0.0/16" : "172.16.0.0/16",
          enable_dns_hostnames: true,
          enable_dns_support: true,
          tags: {
            Name: "main-vpc"
          }
        }}
      />

      <Output
        name="vpc_id"
        value="${aws_vpc.main.id}"
        description="ID of the main VPC"
      />
    </Terraform>
  );
};

export default PracticalInfrastructure;

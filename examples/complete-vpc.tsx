import React from 'react';
import { 
  Terraform, 
  Provider, 
  Resource, 
  Variable, 
  Output,
  Module,
  Data,
  Locals,
  Backend,
  render
} from '../src';

// Reusable component for subnet configuration
interface SubnetConfig {
  cidrBlock: string;
  availabilityZone: string;
  isPublic?: boolean;
  tags?: Record<string, string>;
}

const Subnet: React.FC<SubnetConfig> = ({ 
  cidrBlock, 
  availabilityZone, 
  isPublic = false,
  tags = {} 
}) => (
  <Resource
    type="aws_subnet"
    name={`subnet_${availabilityZone}_${isPublic ? 'public' : 'private'}`}
    attributes={{
      vpc_id: "${aws_vpc.main.id}",
      cidr_block: cidrBlock,
      availability_zone: availabilityZone,
      map_public_ip_on_launch: isPublic,
      tags: {
        Name: `${isPublic ? 'Public' : 'Private'} Subnet - ${availabilityZone}`,
        Type: isPublic ? 'Public' : 'Private',
        ...tags
      }
    }}
  />
);

const CompleteVPCInfrastructure = () => {
  // Define common tags using locals
  const commonTags = {
    Project: "MyApp",
    Environment: "${var.environment}",
    ManagedBy: "Terraform"
  };

  return (
    <Terraform>
      {/* Backend configuration for state management */}
      <Backend
        type="s3"
        configuration={{
          bucket: "my-terraform-state",
          key: "vpc/terraform.tfstate",
          region: "us-west-2",
          encrypt: true,
          dynamodb_table: "terraform-locks"
        }}
      />

      {/* Provider configuration with assumed role */}
      <Provider
        name="aws"
        configuration={{
          region: "us-west-2",
          assume_role: {
            role_arn: "arn:aws:iam::123456789012:role/terraform"
          }
        }}
      />

      {/* Input variables */}
      <Variable
        name="environment"
        type="string"
        default="dev"
        description="Environment name (dev, staging, prod)"
      />

      <Variable
        name="vpc_cidr"
        type="string"
        default="10.0.0.0/16"
        description="CIDR block for VPC"
      />

      {/* Use locals for common values */}
      <Locals
        values={{
          common_tags: commonTags,
          az_names: ["us-west-2a", "us-west-2b", "us-west-2c"]
        }}
      />

      {/* Fetch AZ data from AWS */}
      <Data
        type="aws_availability_zones"
        name="available"
        attributes={{
          state: "available"
        }}
      />

      {/* Use VPC module from registry */}
      <Module
        name="vpc"
        source="terraform-aws-modules/vpc/aws"
        version="5.0.0"
        variables={{
          name: "my-vpc",
          cidr: "${var.vpc_cidr}",
          azs: "${local.az_names}",
          private_subnets: ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"],
          public_subnets: ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"],
          enable_nat_gateway: true,
          single_nat_gateway: true,
          tags: "${local.common_tags}"
        }}
      />

      {/* Additional VPC resources */}
      <Resource
        type="aws_vpc_endpoint"
        name="s3"
        attributes={{
          vpc_id: "${module.vpc.vpc_id}",
          service_name: "com.amazonaws.${data.aws_region.current.name}.s3",
          vpc_endpoint_type: "Gateway",
          route_table_ids: "${module.vpc.private_route_table_ids}",
          tags: "${local.common_tags}"
        }}
      />

      {/* Fetch current region data */}
      <Data
        type="aws_region"
        name="current"
        attributes={{}}
      />

      {/* Outputs */}
      <Output
        name="vpc_id"
        value="${module.vpc.vpc_id}"
        description="ID of the VPC"
      />

      <Output
        name="private_subnet_ids"
        value="${module.vpc.private_subnets}"
        description="IDs of private subnets"
      />

      <Output
        name="public_subnet_ids"
        value="${module.vpc.public_subnets}"
        description="IDs of public subnets"
      />
    </Terraform>
  );
};

console.log(await render(<CompleteVPCInfrastructure />));

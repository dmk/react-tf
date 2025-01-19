import React from 'react';
import { 
  Terraform, 
  Provider, 
  Resource, 
  Variable, 
  Output,
  Data,
  Locals,
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
    <Terraform
      configuration={{
        required_version: ">= 1.0.0",
        required_providers: {
          aws: {
            source: "hashicorp/aws",
            version: "~> 5.0"
          }
        },
        backend: {
          type: "s3",
          configuration: {
            bucket: "my-terraform-state",
            key: "vpc/terraform.tfstate",
            region: "us-west-2",
            encrypt: true,
            dynamodb_table: "terraform-locks"
          }
        }
      }}
    >
      {/* Provider configuration with assumed role */}
      <Provider
        name="aws"
        configuration={{
          region: "us-west-2",
          assume_role: () => ({
            role_arn: "arn:aws:iam::123456789012:role/terraform"
          })
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

      {/* Main VPC */}
      <Resource
        type="aws_vpc"
        name="main"
        attributes={{
          cidr_block: "${var.vpc_cidr}",
          enable_dns_hostnames: true,
          enable_dns_support: true,
          tags: "${local.common_tags}"
        }}
      />

      {/* Internet Gateway */}
      <Resource
        type="aws_internet_gateway"
        name="main"
        attributes={{
          vpc_id: "${aws_vpc.main.id}",
          tags: "${local.common_tags}"
        }}
      />

      {/* Using our Subnet component */}
      <Subnet
        cidrBlock="10.0.1.0/24"
        availabilityZone="us-west-2a"
        isPublic={true}
        tags={commonTags}
      />

      <Subnet
        cidrBlock="10.0.2.0/24"
        availabilityZone="us-west-2b"
        isPublic={true}
        tags={commonTags}
      />

      <Subnet
        cidrBlock="10.0.10.0/24"
        availabilityZone="us-west-2a"
        isPublic={false}
        tags={commonTags}
      />

      <Subnet
        cidrBlock="10.0.11.0/24"
        availabilityZone="us-west-2b"
        isPublic={false}
        tags={commonTags}
      />

      {/* NAT Gateway for private subnets */}
      <Resource
        type="aws_eip"
        name="nat"
        attributes={{
          domain: "vpc",
          tags: "${local.common_tags}"
        }}
      />

      <Resource
        type="aws_nat_gateway"
        name="main"
        attributes={{
          allocation_id: "${aws_eip.nat.id}",
          subnet_id: "${aws_subnet.subnet_us-west-2a_public.id}",
          tags: "${local.common_tags}"
        }}
      />

      {/* Route Tables */}
      <Resource
        type="aws_route_table"
        name="public"
        attributes={{
          vpc_id: "${aws_vpc.main.id}",
          route: [
            {
              cidr_block: "0.0.0.0/0",
              gateway_id: "${aws_internet_gateway.main.id}",
              carrier_gateway_id: null,
              core_network_arn: null,
              destination_prefix_list_id: null,
              egress_only_gateway_id: null,
              ipv6_cidr_block: null,
              local_gateway_id: null,
              nat_gateway_id: null,
              network_interface_id: null,
              transit_gateway_id: null,
              vpc_endpoint_id: null,
              vpc_peering_connection_id: null
            }
          ],
          tags: {
            ...commonTags,
            Name: "Public Route Table"
          }
        }}
      />

      <Resource
        type="aws_route_table"
        name="private"
        attributes={{
          vpc_id: "${aws_vpc.main.id}",
          route: [
            {
              cidr_block: "0.0.0.0/0",
              nat_gateway_id: "${aws_nat_gateway.main.id}",
              carrier_gateway_id: null,
              core_network_arn: null,
              destination_prefix_list_id: null,
              egress_only_gateway_id: null,
              gateway_id: null,
              ipv6_cidr_block: null,
              local_gateway_id: null,
              network_interface_id: null,
              transit_gateway_id: null,
              vpc_endpoint_id: null,
              vpc_peering_connection_id: null
            }
          ],
          tags: {
            ...commonTags,
            Name: "Private Route Table"
          }
        }}
      />

      {/* Route Table Associations */}
      <Resource
        type="aws_route_table_association"
        name="public_a"
        attributes={{
          subnet_id: "${aws_subnet.subnet_us-west-2a_public.id}",
          route_table_id: "${aws_route_table.public.id}"
        }}
      />

      <Resource
        type="aws_route_table_association"
        name="public_b"
        attributes={{
          subnet_id: "${aws_subnet.subnet_us-west-2b_public.id}",
          route_table_id: "${aws_route_table.public.id}"
        }}
      />

      <Resource
        type="aws_route_table_association"
        name="private_a"
        attributes={{
          subnet_id: "${aws_subnet.subnet_us-west-2a_private.id}",
          route_table_id: "${aws_route_table.private.id}"
        }}
      />

      <Resource
        type="aws_route_table_association"
        name="private_b"
        attributes={{
          subnet_id: "${aws_subnet.subnet_us-west-2b_private.id}",
          route_table_id: "${aws_route_table.private.id}"
        }}
      />

      {/* VPC Endpoints */}
      <Resource
        type="aws_vpc_endpoint"
        name="s3"
        attributes={{
          vpc_id: "${aws_vpc.main.id}",
          service_name: "com.amazonaws.${data.aws_region.current.name}.s3",
          vpc_endpoint_type: "Gateway",
          route_table_ids: [
            "${aws_route_table.private.id}",
            "${aws_route_table.public.id}"
          ],
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
        value="${aws_vpc.main.id}"
        description="ID of the VPC"
      />

      <Output
        name="private_subnet_ids"
        value={[
          "${aws_subnet.subnet_us-west-2a_private.id}",
          "${aws_subnet.subnet_us-west-2b_private.id}"
        ]}
        description="IDs of private subnets"
      />

      <Output
        name="public_subnet_ids"
        value={[
          "${aws_subnet.subnet_us-west-2a_public.id}",
          "${aws_subnet.subnet_us-west-2b_public.id}"
        ]}
        description="IDs of public subnets"
      />
    </Terraform>
  );
};

console.log(await render(<CompleteVPCInfrastructure />));

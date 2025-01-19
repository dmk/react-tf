import React from 'react';
import { Resource } from '@dkkoval/react-tf';

export default function VPC() {
  return (
    <Resource type="aws_vpc" name="main" attributes={{
      cidr_block: "10.0.0.0/16",
      enable_dns_hostnames: true,
      enable_dns_support: true,
      tags: {
        Name: "main-vpc",
        Environment: "production"
      }
    }} />
  );
} 
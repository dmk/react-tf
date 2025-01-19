import React from 'react';
import { Resource } from '@dkkoval/react-tf';

export default function Subnets() {
  const publicSubnets = [
    { cidr: "10.0.1.0/24", az: "us-west-2a", name: "public-1" },
    { cidr: "10.0.2.0/24", az: "us-west-2b", name: "public-2" },
  ];

  const privateSubnets = [
    { cidr: "10.0.10.0/24", az: "us-west-2a", name: "private-1" },
    { cidr: "10.0.11.0/24", az: "us-west-2b", name: "private-2" },
  ];

  return (
    <>
      {publicSubnets.map((subnet) => (
        <Resource type="aws_subnet" name={`public_${subnet.name}`} attributes={{
          vpc_id: "${aws_vpc.main.id}",
          cidr_block: subnet.cidr,
          availability_zone: subnet.az,
          map_public_ip_on_launch: true,
          tags: {
            Name: `${subnet.name}`,
            Environment: "production",
            Type: "Public"
          }
        }} />
      ))}

      {privateSubnets.map((subnet) => (
        <Resource type="aws_subnet" name={`private_${subnet.name}`} attributes={{
          vpc_id: "${aws_vpc.main.id}",
          cidr_block: subnet.cidr,
          availability_zone: subnet.az,
          tags: {
            Name: `${subnet.name}`,
            Environment: "production",
            Type: "Private"
          }
        }} />
      ))}
    </>
  );
} 
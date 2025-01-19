import React from 'react';
import { Resource } from '@dkkoval/react-tf';

export default function SecurityGroups() {
  return (
    <>
      <Resource type="aws_security_group" name="bastion" attributes={{
        name: "bastion-sg",
        description: "Security group for bastion host",
        vpc_id: "${aws_vpc.main.id}",
        
        ingress: [
          {
            description: "SSH from anywhere",
            from_port: 22,
            to_port: 22,
            protocol: "tcp",
            cidr_blocks: ["0.0.0.0/0"]
          }
        ],
        
        egress: [
          {
            from_port: 0,
            to_port: 0,
            protocol: "-1",
            cidr_blocks: ["0.0.0.0/0"]
          }
        ],
        
        tags: {
          Name: "bastion-sg",
          Environment: "production"
        }
      }} />

      <Resource type="aws_security_group" name="app_servers" attributes={{
        name: "app-servers-sg",
        description: "Security group for application servers",
        vpc_id: "${aws_vpc.main.id}",
        
        ingress: [
          {
            description: "SSH from bastion",
            from_port: 22,
            to_port: 22,
            protocol: "tcp",
            security_groups: ["${aws_security_group.bastion.id}"]
          },
          {
            description: "HTTP",
            from_port: 80,
            to_port: 80,
            protocol: "tcp",
            cidr_blocks: ["0.0.0.0/0"]
          }
        ],
        
        egress: [
          {
            from_port: 0,
            to_port: 0,
            protocol: "-1",
            cidr_blocks: ["0.0.0.0/0"]
          }
        ],
        
        tags: {
          Name: "app-servers-sg",
          Environment: "production"
        }
      }} />
    </>
  );
} 
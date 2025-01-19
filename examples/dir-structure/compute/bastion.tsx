import React from 'react';
import { Resource } from '@dkkoval/react-tf';

export default function Bastion() {
  return (
    <Resource type="aws_instance" name="bastion" attributes={{
      ami: "ami-0735c191cf914754d",
      instance_type: "t3.micro",
      subnet_id: "${aws_subnet.public_public-1.id}",
      vpc_security_group_ids: ["${aws_security_group.bastion.id}"],
      key_name: "production-key",
      
      tags: {
        Name: "bastion-host",
        Environment: "production"
      }
    }} />
  );
} 
import React from 'react';
import { Resource } from '@dkkoval/react-tf';

export default function AppServers() {
  const appInstances = [
    { name: "app-1", subnet: "private_private-1" },
    { name: "app-2", subnet: "private_private-2" },
  ];

  return (
    <>
      {appInstances.map((instance) => (
        <Resource type="aws_instance" name={instance.name} attributes={{
          ami: "ami-0735c191cf914754d",
          instance_type: "t3.medium",
          subnet_id: "${aws_subnet." + instance.subnet + ".id}",
          vpc_security_group_ids: ["${aws_security_group.app_servers.id}"],
          key_name: "production-key",
          
          user_data: `#!/bin/bash
            apt-get update
            apt-get install -y nginx
            systemctl enable nginx
            systemctl start nginx`,
          
          tags: {
            Name: instance.name,
            Environment: "production",
            Role: "application"
          }
        }} />
      ))}
    </>
  );
} 
# React Terraform Renderer

This project was created as a simple exercise to explore building a React renderer and refresh my Terraform knowledge.
It allows you to write Terraform configurations using React components, leveraging React's composition patterns and TypeScript's type safety.

## Installation

```bash
bun add react-tf-renderer
```

CLI is coming soon.

## Usage

Check out the [examples](examples) directory. You can run them by running:

```bash
bun examples/basic.tsx
```

Here's a basic example:

```tsx
import React from 'react';
import { Terraform, Provider, Resource, render } from 'react-tf-renderer';

const Infrastructure = () => (
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

// Renders to HCL
console.log(await render(<Infrastructure />));
```

## Examples

The [examples](examples) directory contains several examples showcasing different features:

- [Basic Usage](examples/basic.tsx) - Simple provider and resource setup
- [Advanced Configuration](examples/advanced.tsx) - Variables, multiple instances, and outputs
- [React Patterns](examples/patterns.tsx) - Reusable components and composition patterns

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build package
bun run build
```

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

## Author

Dmytro Koval: [GitHub](https://github.com/dmk), [LinkedIn](https://www.linkedin.com/in/dmk/)

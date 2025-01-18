# React Terraform Renderer

Write your Terraform configurations using React components, leveraging React's composition patterns and TypeScript's type safety.

## Installation

```bash
npm install -g @dkkoval/react-tf
```

## CLI Usage

The `react-tf` CLI tool can process individual files or directories:

```bash
# Process current directory
react-tf

# Process specific directory
react-tf ./terraform

# Process specific file
react-tf ./terraform/main.tsx

# Process multiple files
react-tf ./terraform/main.tsx ./terraform/network.tsx

# Mix files and directories
react-tf ./terraform/main.tsx ./other-terraform
```

## Library Usage

Here's a basic example:

```tsx
import { Terraform, Provider, Resource } from '@dkkoval/react-tf';

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

export default Infrastructure;
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

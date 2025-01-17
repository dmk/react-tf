#!/usr/bin/env bun
import { program } from 'commander';
import { glob } from 'glob';
import { join } from 'path';
import { render } from './render';

program
  .name('react-tf')
  .description('React Terraform renderer CLI')
  .version('0.1.0')
  .argument('[dir]', 'Directory containing Terraform JSX/TSX files', '.')
  .action(async (dir: string) => {
    try {
      // Find all JSX/TSX files in the directory
      const files = await glob('**/*.{jsx,tsx}', {
        cwd: dir,
        ignore: ['node_modules/**', 'dist/**']
      });

      if (files.length === 0) {
        console.error('No JSX/TSX files found in the specified directory');
        process.exit(1);
      }

      // Import and render each file
      for (const file of files) {
        const fullPath = join(process.cwd(), dir, file);
        const module = await import(fullPath);
 
        // If the file exports a default component, render it
        if (module.default) {
          console.log(`# Generated from: ${file}`);
          const result = await render(module.default());
          console.log(result);
          console.log('\n');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse(); 
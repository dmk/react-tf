#!/usr/bin/env bun
import { program } from 'commander';
import { processFiles } from './processor';

program
  .name('react-tf')
  .description('React Terraform renderer CLI')
  .version('0.1.0')
  .argument('[dir]', 'Directory containing Terraform JSX/TSX files', '.')
  .action(processFiles);

program.parse(); 
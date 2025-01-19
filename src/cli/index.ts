#!/usr/bin/env bun
import { program } from 'commander';
import { processFiles } from './processor';

program
  .name('react-tf')
  .description('React Terraform renderer CLI')
  .version('0.3.0')
  .argument('[paths...]', 'Directory or specific JSX/TSX files to process', ['.'])
  .option('-o, --output <directory>', 'Output directory for generated Terraform files')
  .action(processFiles);

program.parse();

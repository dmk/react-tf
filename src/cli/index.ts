#!/usr/bin/env bun
import { program } from 'commander';
import { processFiles } from './processor';

program
  .name('react-tf')
  .description('React Terraform renderer CLI')
  .version('0.2.2')
  .argument('[paths...]', 'Directory or specific JSX/TSX files to process', ['.'])
  .action(processFiles);

program.parse();

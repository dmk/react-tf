import { glob } from 'glob';
import { join } from 'path';
import { render } from '@/renderer';

export async function processFiles(paths: string[]) {
  try {
    let filesToProcess: string[] = [];

    for (const path of paths) {
      if (path.endsWith('.jsx') || path.endsWith('.tsx')) {
        // If path is a specific file, add it directly
        filesToProcess.push(path);
      } else {
        // If path is a directory, scan for files
        const files = await glob('**/*.{jsx,tsx}', {
          cwd: path,
          ignore: ['node_modules/**', 'dist/**']
        });
        filesToProcess.push(...files.map(file => join(path, file)));
      }
    }

    if (filesToProcess.length === 0) {
      console.error('No JSX/TSX files found in the specified paths');
      process.exit(1);
    }

    for (const file of filesToProcess) {
      const fullPath = join(process.cwd(), file);
      const module = await import(fullPath);

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
} 
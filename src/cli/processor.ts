import { glob } from 'glob';
import { join, relative, dirname } from 'path';
import { render } from '@/renderer';
import { mkdir, writeFile } from 'fs/promises';

export async function processFiles(paths: string[], options: { output?: string }) {
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
        const result = await render(module.default());
        
        if (options.output) {
          // Get the relative path from the input directory
          const inputDir = paths[0]; // Using the first path as base
          const relPath = relative(inputDir, file);
          const outPath = join(options.output, relPath.replace(/\.tsx?$/, '.tf'));
          
          // Ensure output directory exists
          await mkdir(dirname(outPath), { recursive: true });
          
          // Write the file
          await writeFile(outPath, result);
          console.log(`Generated: ${outPath}`);
        } else {
          // Original stdout behavior
          console.log(`# Generated from: ${file}`);
          console.log(result);
          console.log('\n');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
} 
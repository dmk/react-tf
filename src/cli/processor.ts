import { glob } from 'glob';
import { join } from 'path';
import { render } from '@/renderer';

export async function processFiles(dir: string) {
  try {
    const files = await glob('**/*.{jsx,tsx}', {
      cwd: dir,
      ignore: ['node_modules/**', 'dist/**']
    });

    if (files.length === 0) {
      console.error('No JSX/TSX files found in the specified directory');
      process.exit(1);
    }

    for (const file of files) {
      const fullPath = join(process.cwd(), dir, file);
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
import { cpSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const target = join(root, 'legacy-html', 'images');

mkdirSync(target, { recursive: true });
cpSync(join(root, 'images'), target, { recursive: true, force: true });
cpSync(join(root, 'public', 'favicon.svg'), join(root, 'legacy-html', 'favicon.svg'), { force: true });

console.log('Deploy assets copied to legacy-html/');

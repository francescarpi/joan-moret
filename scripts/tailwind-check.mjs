import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

const deprecatedClasses = new Set();

function extractClasses(content) {
  const classRegex = /class="([^"]+)"/g;
  const classes = [];
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    classes.push(...match[1].split(/\s+/).filter(Boolean));
  }
  return classes;
}

function findFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findFiles(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.astro') || entry.name.endsWith('.html'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const classes = extractClasses(content);
  
  for (const cls of classes) {
    // Only check gradient classes for now
    if (cls.startsWith('bg-gradient')) {
      try {
        const canonical = execSync(`pnpm exec tailwindcss canonicalize ${cls}`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe']
        }).trim();
        
        if (canonical !== cls) {
          deprecatedClasses.add(`${filePath}: ${cls} → ${canonical}`);
        }
      } catch (e) {
        // Class not valid, ignore
      }
    }
  }
}

// Main
const files = findFiles(SRC_DIR);
for (const file of files) {
  checkFile(file);
}

if (deprecatedClasses.size > 0) {
  console.log('⚠️  Deprecated Tailwind classes found:\n');
  for (const msg of deprecatedClasses) {
    console.log(msg);
  }
  process.exit(1);
} else {
  console.log('✅ No deprecated Tailwind classes found');
  process.exit(0);
}
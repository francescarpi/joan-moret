#!/usr/bin/env node
import { execSync } from 'node:child_process';

try {
  execSync('npx tsc --noEmit -p tsconfig.json', { stdio: 'inherit' });
} catch (error) {
  process.exit(error.status ?? 1);
}

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Render/Prod: do NOT seed unless explicitly enabled.
// This avoids creating default credentials/data unexpectedly.
const shouldSeed = String(process.env.RUN_SEED_ON_START || '').toLowerCase() === 'true';
if (!shouldSeed) process.exit(0);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../prisma/seed.js');

console.log('[seed-if-needed] RUN_SEED_ON_START=true. Executando seed...');

const result = spawnSync(process.execPath, [seedPath], {
  encoding: 'utf8',
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  console.error('[seed-if-needed] Falha ao executar seed:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);


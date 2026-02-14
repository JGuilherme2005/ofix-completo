import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const prismaCliPath = require.resolve('prisma/build/index.js');

const result = spawnSync(process.execPath, [prismaCliPath, 'migrate', 'deploy'], {
  encoding: 'utf8',
  stdio: 'pipe',
  env: process.env,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.error) {
  console.error('[prisma-migrate-safe] Falha ao executar Prisma CLI:', result.error.message);
  process.exit(1);
}

if (result.status === 0) {
  process.exit(0);
}

const combinedOutput = `${result.stdout || ''}\n${result.stderr || ''}`;
const isP1001 = combinedOutput.includes('P1001');
const isRenderBuild = process.env.RENDER === 'true';

if (isP1001 && isRenderBuild) {
  console.warn('\n[prisma-migrate-safe] P1001 durante build no Render.');
  console.warn('[prisma-migrate-safe] Build vai continuar; migracao sera aplicada no startup (npm start).');
  process.exit(0);
}

process.exit(result.status || 1);

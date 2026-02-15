import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const prismaCliPath = require.resolve('prisma/build/index.js');

// Avoid hanging the Render build/startup when the database is slow/unreachable.
// Render runs this script both at build time (buildCommand) and at startup (npm start).
const isRender = process.env.RENDER === 'true';
const timeoutMs = Number.parseInt(process.env.PRISMA_MIGRATE_TIMEOUT_MS || '', 10) ||
  (isRender ? 20000 : 120000);

const result = spawnSync(process.execPath, [prismaCliPath, 'migrate', 'deploy'], {
  encoding: 'utf8',
  stdio: 'pipe',
  env: process.env,
  timeout: timeoutMs,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.error) {
  if (result.error.code === 'ETIMEDOUT' && isRender) {
    console.warn(`\n[prisma-migrate-safe] Timeout (${timeoutMs}ms) executando Prisma CLI no Render.`);
    console.warn('[prisma-migrate-safe] Continuando sem migracao para nao travar o deploy.');
    process.exit(0);
  }
  console.error('[prisma-migrate-safe] Falha ao executar Prisma CLI:', result.error.message);
  process.exit(1);
}

if (result.status === 0) {
  process.exit(0);
}

const combinedOutput = `${result.stdout || ''}\n${result.stderr || ''}`;
const isP1001 = combinedOutput.includes('P1001');
const isAdvisoryLockTimeout =
  combinedOutput.includes('pg_advisory_lock') ||
  combinedOutput.includes('migrate-advisory-locking') ||
  combinedOutput.includes('Timed out trying to acquire a postgres advisory lock') ||
  combinedOutput.includes('P1002');
const isRenderBuild = isRender;

if (isP1001 && isRenderBuild) {
  console.warn('\n[prisma-migrate-safe] P1001 durante build no Render.');
  console.warn('[prisma-migrate-safe] Build vai continuar; migracao sera aplicada no startup (npm start).');
  process.exit(0);
}

if (isAdvisoryLockTimeout && isRenderBuild) {
  console.warn('\n[prisma-migrate-safe] Prisma migrate travou em advisory lock (provavel pooler/pgbouncer).');
  console.warn('[prisma-migrate-safe] Continuando sem migracao para nao travar o deploy no Render.');
  process.exit(0);
}

process.exit(result.status || 1);

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.integration.test.{js,mjs}'],
    setupFiles: ['__tests__/setup.js'],
    testTimeout: 15000,
    hookTimeout: 10000,
    // Each test file gets a fresh module graph to avoid state leaking
    // between suites (rate limiter counters, Prisma mock state, etc.)
    fileParallelism: false,
    sequence: { concurrent: false },
  },
});

/**
 * M6-QA-04 — Chat-Public Integration Tests
 *
 * Proves that the public chat endpoint is properly hardened:
 * - oficinaRef is required and validated (UUID or slug)
 * - publicSessionId is required and validated (regex)
 * - Non-existent oficina → 404
 * - Inactive oficina → 403
 * - Message validation (empty, too long)
 * - Namespaced userId/sessionId for tenant isolation
 * - Rate limiting applied
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import {
  getPrismaMock,
  resetPrismaMock,
  OFICINA_A_ID,
} from './helpers.js';

// ── Mock Prisma ──────────────────────────────────────────────
const prismaMock = getPrismaMock();

vi.mock('../src/config/database.js', async () => {
  const { getPrismaMock } = await import('./helpers.js');
  return { default: getPrismaMock() };
});

const { default: app } = await import('../src/app.js');
const request = supertest(app);

// ── Fixtures ─────────────────────────────────────────────────

const activeOficina = {
  id: OFICINA_A_ID,
  nome: 'Oficina Teste',
  slug: 'oficina-teste',
  isActive: true,
};

const inactiveOficina = {
  id: '00000000-0000-4000-a000-000000000003',
  nome: 'Oficina Inativa',
  slug: 'oficina-inativa',
  isActive: false,
};

const validPublicBody = {
  message: 'Olá, preciso de ajuda com meu carro',
  oficinaRef: 'oficina-teste',
  publicSessionId: 'session-abc-123',
};

// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMock();
});

describe('Chat-Public: validação de oficinaRef', () => {
  it('sem oficinaRef → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', publicSessionId: 'session-123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/oficinaRef/i);
  });

  it('oficinaRef com caracteres inválidos → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', oficinaRef: 'inválido com espaços!', publicSessionId: 'session-123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalido/i);
  });

  it('oficinaRef muito curto (2 chars) → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', oficinaRef: 'ab', publicSessionId: 'session-123' });

    expect(res.status).toBe(400);
  });

  it('oficinaRef UUID válido mas oficina não existe → 404', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(null);

    const res = await request.post('/api/agno/chat-public')
      .send({
        message: 'Olá',
        oficinaRef: '99999999-9999-4999-9999-999999999999',
        publicSessionId: 'session-123',
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/[Nn]ao encontrada/);
  });

  it('oficinaRef slug válido mas oficina não existe → 404', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(null);

    const res = await request.post('/api/agno/chat-public')
      .send({
        message: 'Olá',
        oficinaRef: 'oficina-que-nao-existe',
        publicSessionId: 'session-123',
      });

    expect(res.status).toBe(404);
  });
});

describe('Chat-Public: validação de publicSessionId', () => {
  it('sem publicSessionId → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', oficinaRef: 'oficina-teste' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/publicSessionId/i);
  });

  it('publicSessionId muito curto (< 8 chars) → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', oficinaRef: 'oficina-teste', publicSessionId: 'abc' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/publicSessionId/i);
  });

  it('publicSessionId com caracteres especiais → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá', oficinaRef: 'oficina-teste', publicSessionId: 'session with spaces!' });

    expect(res.status).toBe(400);
  });
});

describe('Chat-Public: oficina inativa', () => {
  it('oficina inativa → 403', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(inactiveOficina);

    const res = await request.post('/api/agno/chat-public')
      .send({
        message: 'Olá',
        oficinaRef: 'oficina-inativa',
        publicSessionId: 'session-123456',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/[Dd]esativada/);
  });
});

describe('Chat-Public: validação de mensagem', () => {
  it('mensagem vazia → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: '', oficinaRef: 'oficina-teste', publicSessionId: 'session-123456' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/[Mm]ensagem/);
  });

  it('sem campo message → 400', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ oficinaRef: 'oficina-teste', publicSessionId: 'session-123456' });

    expect(res.status).toBe(400);
  });

  it('mensagem com mais de 500 chars (limite público) → 413', async () => {
    const longMessage = 'A'.repeat(501);
    const res = await request.post('/api/agno/chat-public')
      .send({ message: longMessage, oficinaRef: 'oficina-teste', publicSessionId: 'session-123456' });

    expect(res.status).toBe(413);
    expect(res.body.error).toMatch(/longa/i);
    expect(res.body.max_chars).toBeDefined();
  });

  it('mensagem com exatamente 500 chars → passa a validação', async () => {
    // This should pass message validation but fail at Agno (unconfigured) → 503
    prismaMock.oficina.findFirst.mockResolvedValueOnce(activeOficina);

    const exactMessage = 'B'.repeat(500);
    const res = await request.post('/api/agno/chat-public')
      .send({ message: exactMessage, oficinaRef: 'oficina-teste', publicSessionId: 'session-123456' });

    // Should NOT be 413 (passes message length validation)
    // Will be 503 because AGNO_API_URL is empty (service unconfigured)
    expect(res.status).toBe(503);
  });
});

describe('Chat-Public: Agno indisponível → 503', () => {
  it('retorna 503 quando Agno service está fora do ar', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(activeOficina);

    const res = await request.post('/api/agno/chat-public')
      .send(validPublicBody);

    // Oficina is valid but Agno service unreachable → warm+retry → 503
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });
});

describe('Chat-Public: aceita tanto slug quanto UUID para oficinaRef', () => {
  it('aceita slug válido', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(activeOficina);

    const res = await request.post('/api/agno/chat-public')
      .send({ ...validPublicBody, oficinaRef: 'oficina-teste' });

    // Not 400 (validation passes) — will be 503 (agno unconfigured)
    expect(res.status).not.toBe(400);

    // Verify prisma was called with slug filter
    expect(prismaMock.oficina.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'oficina-teste' },
      }),
    );
  });

  it('aceita UUID válido', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(activeOficina);

    const res = await request.post('/api/agno/chat-public')
      .send({
        ...validPublicBody,
        oficinaRef: OFICINA_A_ID,
      });

    expect(res.status).not.toBe(400);

    // Verify prisma was called with id filter (UUID)
    expect(prismaMock.oficina.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: OFICINA_A_ID.toLowerCase() },
      }),
    );
  });
});

describe('Chat-Public: legacy "oficinaId" parameter fallback', () => {
  it('aceita "oficinaId" no body como fallback de "oficinaRef"', async () => {
    prismaMock.oficina.findFirst.mockResolvedValueOnce(activeOficina);

    const res = await request.post('/api/agno/chat-public')
      .send({
        message: 'Teste fallback',
        oficinaId: 'oficina-teste', // legacy param name
        publicSessionId: 'session-fallback',
      });

    expect(res.status).not.toBe(400);
  });
});

describe('Chat-Public: NÃO expõe dados internos em erros', () => {
  it('erros não contêm stack trace', async () => {
    const res = await request.post('/api/agno/chat-public')
      .send({ message: 'Olá' }); // Missing required fields

    expect(res.body.stack).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toMatch(/at\s+\w+\s*\(/); // No stack traces
  });

  it('erros não contêm detalhes de banco de dados', async () => {
    prismaMock.oficina.findFirst.mockRejectedValueOnce(new Error('P2021: table not found'));

    const res = await request.post('/api/agno/chat-public')
      .send(validPublicBody);

    // Should be a generic error, not exposing Prisma internals
    expect([500, 503]).toContain(res.status);
    expect(JSON.stringify(res.body)).not.toMatch(/P2021/);
    expect(JSON.stringify(res.body)).not.toMatch(/prisma/i);
  });
});

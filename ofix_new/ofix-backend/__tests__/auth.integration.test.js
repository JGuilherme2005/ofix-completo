/**
 * M6-QA-04 — Auth Integration Tests
 *
 * Proves that the security hardening (M1) actually works:
 * - Protected endpoints reject requests without token → 401
 * - Expired tokens → 401
 * - Tampered/bad-signature tokens → 401
 * - Valid tokens → pass through to controller
 * - Login returns JWT with correct payload
 * - Register creates user + oficina atomically
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import {
  generateToken,
  generateExpiredToken,
  generateBadSignatureToken,
  getPrismaMock,
  resetPrismaMock,
  OFICINA_A_ID,
  USER_A_ID,
} from './helpers.js';

// ── Mock Prisma BEFORE app is imported ───────────────────────
const prismaMock = getPrismaMock();

vi.mock('../src/config/database.js', async () => {
  const { getPrismaMock } = await import('./helpers.js');
  return { default: getPrismaMock() };
});

// Now import app (all route modules will get the mocked prisma)
const { default: app } = await import('../src/app.js');
const request = supertest(app);

// ─────────────────────────────────────────────────────────────
// Test Data
// ─────────────────────────────────────────────────────────────

const validToken = generateToken({ userId: USER_A_ID, oficinaId: OFICINA_A_ID });
const expiredToken = generateExpiredToken();
const badSignatureToken = generateBadSignatureToken();

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMock();
});

describe('Auth: endpoints protegidos rejeitam sem token', () => {
  const protectedEndpoints = [
    ['GET', '/api/clientes'],
    ['POST', '/api/clientes'],
    ['GET', '/api/veiculos'],
    ['GET', '/api/pecas'],
    ['GET', '/api/fornecedores'],
    ['GET', '/api/financeiro'],
    ['GET', '/api/auth/profile'],
    ['GET', '/api/agno/status'],
    ['GET', '/api/agno/config'],
  ];

  it.each(protectedEndpoints)(
    '%s %s → 401 sem Authorization header',
    async (method, path) => {
      const res = await request[method.toLowerCase()](path);
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    },
  );

  it.each(protectedEndpoints)(
    '%s %s → 401 com token expirado',
    async (method, path) => {
      const res = await request[method.toLowerCase()](path)
        .set('Authorization', `Bearer ${expiredToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/expirado/i);
    },
  );

  it.each(protectedEndpoints)(
    '%s %s → 401 com assinatura inválida',
    async (method, path) => {
      const res = await request[method.toLowerCase()](path)
        .set('Authorization', `Bearer ${badSignatureToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/inválido/i);
    },
  );

  it('rejeita token com formato Bearer malformado', async () => {
    const res = await request.get('/api/clientes')
      .set('Authorization', 'NotBearer some-token');
    expect(res.status).toBe(401);
  });

  it('rejeita header Authorization vazio', async () => {
    const res = await request.get('/api/clientes')
      .set('Authorization', '');
    expect(res.status).toBe(401);
  });
});

describe('Auth: token válido passa pelo protectRoute', () => {
  it('GET /api/clientes com token válido → 200 (lista vazia)', async () => {
    prismaMock.cliente.findMany.mockResolvedValueOnce([]);

    const res = await request.get('/api/clientes')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/auth/profile com token válido → busca user correto', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: USER_A_ID,
      nome: 'Teste',
      email: 'test@ofix.com',
      role: 'GESTOR_OFICINA',
      oficinaId: OFICINA_A_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
      oficina: { id: OFICINA_A_ID, nome: 'Oficina Teste' },
    });

    const res = await request.get('/api/auth/profile')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.id).toBe(USER_A_ID);
    // Verify prisma was called with the userId from the token
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: USER_A_ID },
      }),
    );
  });
});

describe('Auth: login', () => {
  it('POST /api/auth/login sem campos → 400', async () => {
    const res = await request.post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login com credenciais inválidas → 401', async () => {
    // loginUser returns null when credentials are wrong
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const res = await request.post('/api/auth/login')
      .send({ email: 'nope@ofix.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login com credenciais válidas → 200 + JWT', async () => {
    // Need bcrypt-hashed password for 'admin123'
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.hash('admin123', 10);

    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: USER_A_ID,
      nome: 'Admin',
      email: 'admin@ofix.com',
      password: hashed,
      role: 'GESTOR_OFICINA',
      oficinaId: OFICINA_A_ID,
      oficina: { id: OFICINA_A_ID, nome: 'Oficina Teste' },
    });

    const res = await request.post('/api/auth/login')
      .send({ email: 'admin@ofix.com', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('admin@ofix.com');
    // Password should NOT be in the response
    expect(res.body.user.password).toBeUndefined();

    // Decode the returned JWT and verify payload
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.decode(res.body.token);
    expect(decoded.userId).toBe(USER_A_ID);
    expect(decoded.oficinaId).toBe(OFICINA_A_ID);
    expect(decoded.role).toBe('GESTOR_OFICINA');
  });
});

describe('Auth: register', () => {
  it('POST /api/auth/register sem campos obrigatórios → 400', async () => {
    const res = await request.post('/api/auth/register')
      .send({ nomeUser: 'Apenas nome' }); // missing emailUser, passwordUser, nomeOficina
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register com senha curta → 400', async () => {
    const res = await request.post('/api/auth/register')
      .send({
        nomeUser: 'Teste',
        emailUser: 'novo@ofix.com',
        passwordUser: '123', // < 6 chars
        nomeOficina: 'Nova Oficina',
      });
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/register com dados válidos → 201 + user criado', async () => {
    const newOficinaId = '00000000-0000-4000-a000-000000000099';
    const newUserId = '00000000-0000-4000-b000-000000000099';

    // Mock $transaction to simulate create oficina + user
    prismaMock.$transaction.mockImplementationOnce(async (fn) => {
      const tx = {
        oficina: {
          create: vi.fn().mockResolvedValue({ id: newOficinaId, nome: 'Nova Oficina' }),
        },
        user: {
          create: vi.fn().mockResolvedValue({
            id: newUserId,
            nome: 'Novo User',
            email: 'novo@ofix.com',
            role: 'GESTOR_OFICINA',
            oficinaId: newOficinaId,
            oficina: { id: newOficinaId, nome: 'Nova Oficina' },
          }),
        },
      };
      return fn(tx);
    });

    const res = await request.post('/api/auth/register')
      .send({
        nomeUser: 'Novo User',
        emailUser: 'novo@ofix.com',
        passwordUser: 'senha123',
        nomeOficina: 'Nova Oficina',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('novo@ofix.com');
  });
});

describe('Auth: health check (público)', () => {
  it('GET /health → 200 sem autenticação', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('GET /api → 200 sem autenticação', async () => {
    const res = await request.get('/api');
    expect(res.status).toBe(200);
  });
});

/**
 * M6-QA-04 — Tenant Isolation Integration Tests
 *
 * The DEFINITIVE proof that multi-tenancy works:
 * - User from Oficina A can ONLY access Oficina A data
 * - User from Oficina A CANNOT read/update/delete Oficina B data
 * - oficinaId is always taken from the JWT, never from the client
 * - Guest users get masked PII and cannot write
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import {
  generateToken,
  getPrismaMock,
  resetPrismaMock,
  OFICINA_A_ID,
  OFICINA_B_ID,
  USER_A_ID,
  USER_B_ID,
  CLIENTE_A_ID,
  CLIENTE_B_ID,
} from './helpers.js';

// ── Mock Prisma ──────────────────────────────────────────────
const prismaMock = getPrismaMock();

vi.mock('../src/config/database.js', async () => {
  const { getPrismaMock } = await import('./helpers.js');
  return { default: getPrismaMock() };
});

const { default: app } = await import('../src/app.js');
const request = supertest(app);

// ── Tokens ───────────────────────────────────────────────────
const tokenA = generateToken({ userId: USER_A_ID, oficinaId: OFICINA_A_ID, email: 'userA@ofix.com' });
const tokenB = generateToken({ userId: USER_B_ID, oficinaId: OFICINA_B_ID, email: 'userB@ofix.com' });
const guestToken = generateToken({
  userId: '00000000-0000-4000-b000-000000000099',
  oficinaId: OFICINA_A_ID,
  email: 'convidado_abc123@ofix.temp',
  role: 'USER',
});

// ── Fixtures ─────────────────────────────────────────────────

const clienteOficinaA = {
  id: CLIENTE_A_ID,
  nomeCompleto: 'João da Silva',
  cpfCnpj: '123.456.789-00',
  telefone: '(11) 99999-0001',
  email: 'joao@email.com',
  endereco: 'Rua A, 123',
  oficinaId: OFICINA_A_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  veiculos: [],
};

const clienteOficinaB = {
  id: CLIENTE_B_ID,
  nomeCompleto: 'Maria Oliveira',
  cpfCnpj: '987.654.321-00',
  telefone: '(21) 88888-0002',
  email: 'maria@email.com',
  endereco: 'Rua B, 456',
  oficinaId: OFICINA_B_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  veiculos: [],
};

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMock();
});

describe('Tenant Isolation: listagem filtrada por oficina', () => {
  it('User A lista clientes → recebe apenas clientes da Oficina A', async () => {
    prismaMock.cliente.findMany.mockResolvedValueOnce([clienteOficinaA]);

    const res = await request.get('/api/clientes')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(CLIENTE_A_ID);
    expect(res.body[0].oficinaId).toBe(OFICINA_A_ID);

    // CRITICAL: Prisma was called with the oficinaId from the JWT
    expect(prismaMock.cliente.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { oficinaId: OFICINA_A_ID },
      }),
    );
  });

  it('User B lista clientes → recebe apenas clientes da Oficina B', async () => {
    prismaMock.cliente.findMany.mockResolvedValueOnce([clienteOficinaB]);

    const res = await request.get('/api/clientes')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].oficinaId).toBe(OFICINA_B_ID);

    expect(prismaMock.cliente.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { oficinaId: OFICINA_B_ID },
      }),
    );
  });
});

describe('Tenant Isolation: acesso cruzado ao detalhe é bloqueado', () => {
  it('User A busca cliente da Oficina B por ID → 404', async () => {
    // Prisma findFirst with { id: CLIENTE_B_ID, oficinaId: OFICINA_A_ID } → null
    prismaMock.cliente.findFirst.mockResolvedValueOnce(null);

    const res = await request.get(`/api/clientes/${CLIENTE_B_ID}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(404);

    // Verify the query included User A's oficinaId (not B's)
    expect(prismaMock.cliente.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: CLIENTE_B_ID, oficinaId: OFICINA_A_ID },
      }),
    );
  });

  it('User B busca cliente da Oficina A por ID → 404', async () => {
    prismaMock.cliente.findFirst.mockResolvedValueOnce(null);

    const res = await request.get(`/api/clientes/${CLIENTE_A_ID}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);

    expect(prismaMock.cliente.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: CLIENTE_A_ID, oficinaId: OFICINA_B_ID },
      }),
    );
  });
});

describe('Tenant Isolation: update/delete cross-tenant bloqueado', () => {
  it('User A tenta atualizar cliente da Oficina B → 404', async () => {
    // findFirst returns null → cliente não existe nesta oficina
    prismaMock.cliente.findFirst.mockResolvedValueOnce(null);

    const res = await request.put(`/api/clientes/${CLIENTE_B_ID}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ nomeCompleto: 'Hackeado', telefone: '11999887766' });

    expect(res.status).toBe(404);
  });

  it('User A tenta deletar cliente da Oficina B → 404', async () => {
    prismaMock.cliente.findFirst.mockResolvedValueOnce(null);

    const res = await request.delete(`/api/clientes/${CLIENTE_B_ID}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(404);
  });
});

describe('Tenant Isolation: criação vincula à oficina do JWT', () => {
  it('POST /api/clientes vincula automaticamente à oficina do token', async () => {
    prismaMock.cliente.create.mockResolvedValueOnce({
      ...clienteOficinaA,
      id: '00000000-0000-4000-c000-000000000099',
      nomeCompleto: 'Novo Cliente',
    });

    const res = await request.post('/api/clientes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ nomeCompleto: 'Novo Cliente', telefone: '(11) 11111-1111' });

    expect(res.status).toBe(201);

    // CRITICAL: The create call used oficina from JWT, not from request body
    expect(prismaMock.cliente.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          oficina: { connect: { id: OFICINA_A_ID } },
        }),
      }),
    );
  });

  it('client NÃO consegue forçar oficinaId diferente no body', async () => {
    prismaMock.cliente.create.mockResolvedValueOnce({
      ...clienteOficinaA,
      id: '00000000-0000-4000-c000-000000000098',
    });

    const res = await request.post('/api/clientes')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        nomeCompleto: 'Tentativa Hijack',
        telefone: '(11) 22222-2222',
        oficinaId: OFICINA_B_ID, // Attacker tries to inject different oficinaId
      });

    // Even if the request body has oficinaId=B, the controller uses JWT's oficinaId=A
    expect(res.status).toBe(201);
    expect(prismaMock.cliente.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          oficina: { connect: { id: OFICINA_A_ID } }, // Still A's
        }),
      }),
    );
  });
});

describe('Tenant Isolation: guest user restrictions', () => {
  it('Guest NÃO pode criar cliente → 403', async () => {
    const res = await request.post('/api/clientes')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ nomeCompleto: 'Guest Create', telefone: '(11) 33333-3333' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/convidado/i);
  });

  it('Guest NÃO pode atualizar cliente → 403', async () => {
    const res = await request.put(`/api/clientes/${CLIENTE_A_ID}`)
      .set('Authorization', `Bearer ${guestToken}`)
      .send({ nomeCompleto: 'Updated by Guest', telefone: '11999887766' });

    expect(res.status).toBe(403);
  });

  it('Guest NÃO pode deletar cliente → 403', async () => {
    const res = await request.delete(`/api/clientes/${CLIENTE_A_ID}`)
      .set('Authorization', `Bearer ${guestToken}`);

    expect(res.status).toBe(403);
  });

  it('Guest PODE listar clientes mas com PII mascarada', async () => {
    prismaMock.cliente.findMany.mockResolvedValueOnce([{
      ...clienteOficinaA,
      cpfCnpj: '123.456.789-00',
      telefone: '(11) 99999-0001',
      email: 'joao@email.com',
      endereco: 'Rua A, 123',
    }]);

    const res = await request.get('/api/clientes')
      .set('Authorization', `Bearer ${guestToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    // PII should be masked
    expect(res.body[0].cpfCnpj).toMatch(/\*+/);
    expect(res.body[0].telefone).toMatch(/\*+/);
    expect(res.body[0].email).toMatch(/\*+/);
    expect(res.body[0].endereco).toMatch(/[Oo]culto/);
    // But the name is visible
    expect(res.body[0].nomeCompleto).toBe('João da Silva');
  });
});

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * ConversasService — Milestone 2 (Clean Slate)
 *
 * Opera sobre os modelos ChatSession / ChatMessage (UUID + oficinaId).
 * Todos os métodos exigem oficinaId para garantir isolamento multi-tenant.
 *
 * Prisma accessors:
 *   prisma.chatSession   (tabela chat_sessions)
 *   prisma.chatMessage   (tabela chat_messages)
 */
class ConversasService {

  // ---------------------------------------------------------------------------
  // salvarConversa — cria ou reutiliza sessão OPEN e adiciona par user/assistant
  // ---------------------------------------------------------------------------
  /**
   * @param {Object} params
   * @param {string} params.oficinaId  - UUID da oficina (obrigatório, vem de req.user)
   * @param {string} params.usuarioId  - UUID do User (obrigatório)
   * @param {string} params.pergunta   - Texto enviado pelo usuário
   * @param {string} params.resposta   - Texto da resposta do assistente
   * @param {object|string} [params.contexto] - Metadados opcionais (classificação, etc.)
   * @param {Date}   [params.timestamp]
   * @returns {{ sessionId: string, messageId: string, conversaId: string }}
   */
  static async salvarConversa({ oficinaId, usuarioId, pergunta, resposta, contexto, timestamp }) {
    if (!oficinaId) throw new Error('oficinaId é obrigatório para salvar conversa');
    if (!usuarioId) throw new Error('usuarioId é obrigatório para salvar conversa');

    try {
      // 1. Buscar ou criar sessão OPEN para este user + oficina
      let session = await prisma.chatSession.findFirst({
        where: {
          oficinaId,
          userId: usuarioId,
          status: 'OPEN',
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!session) {
        session = await prisma.chatSession.create({
          data: {
            oficinaId,
            userId: usuarioId,
            titulo: `Conversa - ${new Date().toLocaleDateString('pt-BR')}`,
            status: 'OPEN',
            isPublic: false,
          },
        });
        console.log('🆕 Nova ChatSession criada:', session.id);
      }

      // 2. Parsear contexto (pode vir como string JSON dos call sites)
      let parsedCtx = {};
      if (contexto) {
        try {
          parsedCtx = typeof contexto === 'string' ? JSON.parse(contexto) : contexto;
        } catch { parsedCtx = {}; }
      }

      // 3. Salvar mensagem do usuário
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'user',
          content: pergunta,
          metadata: {
            timestamp: timestamp || new Date(),
            contexto: parsedCtx,
          },
        },
      });

      // 4. Salvar resposta do assistente
      const assistantMsg = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: 'assistant',
          content: resposta,
          metadata: {
            timestamp: timestamp || new Date(),
          },
        },
      });

      console.log('✅ Mensagens salvas na ChatSession:', session.id);
      return {
        sessionId: session.id,
        messageId: assistantMsg.id,
        // Compat: call sites antigos acessavam .conversaId
        conversaId: session.id,
      };

    } catch (error) {
      console.error('❌ Erro ao salvar conversa:', error);
      throw new Error(`Erro ao salvar conversa: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // obterHistorico — lista sessões (com mensagens) para um user+oficina
  // ---------------------------------------------------------------------------
  /**
   * @param {string} oficinaId  - UUID da oficina (obrigatório)
   * @param {string} usuarioId  - UUID do User
   * @param {number} [limite=10]
   */
  static async obterHistorico(oficinaId, usuarioId, limite = 10) {
    if (!oficinaId) throw new Error('oficinaId é obrigatório para obter histórico');

    try {
      const sessions = await prisma.chatSession.findMany({
        where: {
          oficinaId,
          userId: usuarioId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limite,
      });

      console.log(`📚 Histórico: ${sessions.length} sessões para user ${usuarioId} @ oficina ${oficinaId}`);

      // Mapear para formato compatível com call sites existentes
      return sessions.map(s => ({
        id: s.id,
        titulo: s.titulo,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        mensagens: s.messages.map(m => ({
          id: m.id,
          tipo: m.role === 'user' ? 'user' : 'matias',
          conteudo: m.content,
          metadata: m.metadata,
          createdAt: m.createdAt,
        })),
      }));

    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error);
      throw new Error(`Erro ao obter histórico: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // buscarConversas — full-text search em mensagens por oficina+user
  // ---------------------------------------------------------------------------
  /**
   * @param {string} oficinaId
   * @param {string} usuarioId
   * @param {string} palavraChave
   */
  static async buscarConversas(oficinaId, usuarioId, palavraChave) {
    if (!oficinaId) throw new Error('oficinaId é obrigatório para buscar conversas');

    try {
      const sessions = await prisma.chatSession.findMany({
        where: {
          oficinaId,
          userId: usuarioId,
          messages: {
            some: {
              content: { contains: palavraChave, mode: 'insensitive' },
            },
          },
        },
        include: {
          messages: {
            where: {
              content: { contains: palavraChave, mode: 'insensitive' },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      console.log(`🔍 Busca: ${sessions.length} sessões com "${palavraChave}"`);
      return sessions;

    } catch (error) {
      console.error('❌ Erro na busca:', error);
      throw new Error(`Erro na busca: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // obterEstatisticasConversas — contadores por oficina+user
  // ---------------------------------------------------------------------------
  /**
   * @param {string} oficinaId
   * @param {string} usuarioId
   */
  static async obterEstatisticasConversas(oficinaId, usuarioId) {
    if (!oficinaId) throw new Error('oficinaId é obrigatório para estatísticas');

    try {
      const whereSession = { oficinaId, userId: usuarioId };

      const total = await prisma.chatSession.count({ where: whereSession });

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const sessionsHoje = await prisma.chatSession.count({
        where: { ...whereSession, createdAt: { gte: hoje } },
      });

      const totalMensagens = await prisma.chatMessage.count({
        where: { session: whereSession },
      });

      const ultimaSessao = await prisma.chatSession.findFirst({
        where: whereSession,
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true, titulo: true },
      });

      return {
        total_conversas: total,
        conversas_hoje: sessionsHoje,
        total_mensagens: totalMensagens,
        ultima_conversa: ultimaSessao?.updatedAt,
        ultima_conversa_titulo: ultimaSessao?.titulo,
        oficina_id: oficinaId,
        usuario_id: usuarioId,
      };

    } catch (error) {
      console.error('❌ Erro nas estatísticas:', error);
      throw new Error(`Erro nas estatísticas: ${error.message}`);
    }
  }
}

export default ConversasService;
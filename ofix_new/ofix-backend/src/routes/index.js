import { Router } from 'express';
import servicosRouter from './servicos.routes.js';
import authRouter from './auth.routes.js';
import clientesRouter from './clientes.routes.js';
import procedimentosRouter from './procedimentos.routes.js';
import mensagensRouter from './mensagens.routes.js';
import pecasRouter from './pecas.routes.js';
import fornecedoresRouter from './fornecedores.routes.js';
import financeiroRouter from './financeiro.routes.js';
import veiculosRouter from './veiculos.routes.js';
import agnoRouter from './agno.routes.js';
import matiasRouter from './matias.routes.js';
import logsRouter from './logs.routes.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX esta no ar! Versao 1.0' });
});

router.post('/agno-test', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensagem e obrigatoria' });
    }

    const msgLower = message.toLowerCase();
    let response;

    if (msgLower.includes('servico') || msgLower.includes('problema') || msgLower.includes('carro')) {
      response = `Assistente OFIX\n\nVoce mencionou: "${message}"\n\nPosso ajudar com:\n- Diagnostico de problemas automotivos\n- Informacoes sobre servicos\n- Consulta de pecas\n- Agendamento de manutencao\n\nSistema funcionando em modo direto.`;
    } else if (msgLower.includes('preco') || msgLower.includes('valor') || msgLower.includes('custo')) {
      response = `Consulta de Precos\n\nPara "${message}":\n\nServicos populares:\n- Troca de oleo: R$ 80-120\n- Revisao completa: R$ 200-400\n- Diagnostico: R$ 50-100\n\nPara valores exatos, consulte nossa equipe.`;
    } else {
      response = `OFIX Assistant\n\nOla! Voce disse: "${message}"\n\nComo posso ajudar:\n- Problemas no veiculo\n- Informacoes sobre servicos\n- Consultas de pecas\n- Agendamentos\n\nAssistente funcionando perfeitamente.`;
    }

    return res.json({
      success: true,
      response,
      mode: 'direct-fallback',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno',
      message: error.message,
    });
  }
});

router.use('/auth', authRouter);
router.use('/logs', logsRouter);
router.use('/servicos', servicosRouter);
router.use('/clientes', protectRoute, clientesRouter);
router.use('/procedimentos', protectRoute, procedimentosRouter);
router.use('/mensagens', protectRoute, mensagensRouter);
router.use('/pecas', protectRoute, pecasRouter);
router.use('/fornecedores', protectRoute, fornecedoresRouter);
router.use('/financeiro', protectRoute, financeiroRouter);
router.use('/veiculos', protectRoute, veiculosRouter);
router.use('/agno', agnoRouter);
router.use('/matias', matiasRouter);

export default router;

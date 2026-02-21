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
import aiRouter from './ai.routes.js';
import logsRouter from './logs.routes.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API OFIX esta no ar! Versao 1.0' });
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
router.use('/ai', aiRouter);
router.use('/agno', agnoRouter);
router.use('/matias', matiasRouter);

export default router;

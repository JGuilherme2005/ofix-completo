import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index.js';
import { securityHeaders, rateLimit } from './middlewares/security.middleware.js';
import { sanitizeInput } from './middlewares/validation.middleware.js';

class Application {
  constructor() {
    this.server = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupMiddlewares() {
    // Trust proxy para obter IP real (necessario para rate limiting e logs)
    // Precisa vir antes de qualquer middleware que use req.ip.
    this.server.set('trust proxy', 1);

    // Middlewares de segurança (aplicados primeiro)
    this.server.use(securityHeaders);
    
    // Rate limiting (apenas em produção para não atrapalhar desenvolvimento)
    if (process.env.NODE_ENV === 'production') {
      this.server.use(rateLimit);
    }
    // --- INÍCIO DA CORREÇÃO DO CORS ---

    // 1. Defina quais "origens" (sites) têm permissão para acessar sua API
    const allowedOrigins = [
      'https://ofix.vercel.app',  // URL de produção do seu frontend (antiga)
      'https://ofix-completo.vercel.app', // URL real do Vercel
      'https://pista.com.br',     // Novo domínio Pista
      'https://www.pista.com.br', // Novo domínio Pista (www)
      'http://localhost:5173',   // URL para desenvolvimento local com Vite
      'http://localhost:5174',   // URL para desenvolvimento local com Vite (porta alternativa)
      'http://localhost:3000',   // Outra URL comum para desenvolvimento local
      'http://localhost:4173',   // Vite preview
      'http://localhost:4174'    // Vite preview alternativa
    ];

    function isAllowedOrigin(origin) {
      if (!origin) return true;
      if (allowedOrigins.includes(origin)) return true;

      try {
        const url = new URL(origin);
        const hostname = url.hostname.toLowerCase();

        // Allow Vercel deployments for this project (preview + branch alias).
        // Examples:
        // - https://ofix-completo-xxxxxx-catgreens-projects.vercel.app
        // - https://ofix-completo-git-branch-catgreens-projects.vercel.app
        if (url.protocol === 'https:' && hostname.endsWith('.vercel.app')) {
          if (hostname === 'ofix-completo.vercel.app') return true;

          const isSameVercelTeam = hostname.endsWith('-catgreens-projects.vercel.app');
          const isOfixProject =
            hostname.startsWith('ofix-completo-') || hostname.startsWith('ofix-completo-git-')
            || hostname.startsWith('pista-') || hostname.startsWith('pista-git-');

          if (isSameVercelTeam && isOfixProject) return true;
        }
      } catch {
        // Ignore invalid origin strings.
      }

      // Em desenvolvimento, permite qualquer localhost
      if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) return true;

      return false;
    }

    // 2. Crie as opções do CORS
    const corsOptions = {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
      credentials: true, // Se precisar enviar cookies ou headers de autorização
    };

    // 3. Use o middleware CORS com as opções configuradas
    // For development, you can use a more permissive CORS setup
    if (process.env.NODE_ENV === 'development') {
      this.server.use(cors({
        origin: true, // Allow all origins in development
        credentials: true
      }));
    } else {
      this.server.use(cors(corsOptions));
    }

    // --- FIM DA CORREÇÃO DO CORS ---

    // Middleware para parsing JSON com limite de tamanho (reduzido de 10mb — M1-SEC-04)
    this.server.use(express.json({ limit: '1mb' }));
    this.server.use(express.urlencoded({ extended: true, limit: '1mb' }));
    
    // Middleware de sanitização de entrada
    this.server.use(sanitizeInput);

    // Logging de requisições (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      this.server.use((req, res, next) => {
        console.log(`Requisição recebida: ${req.method} ${req.url}`);
        next();
      });
    }
  }

  setupRoutes() {
    // Health check endpoint
    this.server.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        message: 'OFIX Backend funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    this.server.use('/api', routes);
    // M1-SEC-10: removed duplicate /agno mount — use /api/agno/* exclusively.
    this.server.get('/', (req, res) => {
      res.json({ message: 'Bem-vindo à API OFIX!' });
    });
  }

  setupErrorHandler() {
    this.server.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      const isDev = process.env.NODE_ENV === 'development';

      // Only log full stack in dev; in prod, log a one-liner to avoid PII/secret leaks.
      if (isDev) {
        console.error(err.stack);
      } else {
        console.error(`[ERROR] ${req.method} ${req.path} — ${err.message || 'unknown'}`);
      }

      const status = err.status || 500;
      res.status(status).json({
        error: {
          message: isDev ? (err.message || 'Erro interno.') : 'Ocorreu um erro interno no servidor.',
          ...(isDev && { stack: err.stack }),
        },
      });
    });
  }
}

export default new Application().server;

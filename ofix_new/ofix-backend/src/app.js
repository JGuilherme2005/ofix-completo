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
    // Trust proxy to get real IP (required for rate limiting and logs)
    this.server.set('trust proxy', 1);

    // CORS must run before rate limiting, otherwise blocked preflight looks like random CORS failures.
    const defaultAllowedOrigins = [
      'https://ofix.vercel.app',
      'https://ofix-completo.vercel.app',
      'https://pista.com.br',
      'https://www.pista.com.br',
      'https://pistabr.com.br',
      'https://www.pistabr.com.br',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:4173',
      'http://localhost:4174',
    ];

    const envAllowedOrigins = (process.env.CORS_ORIGIN || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);

    const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

    function isAllowedOrigin(origin) {
      if (!origin) return true;
      if (allowedOrigins.includes(origin)) return true;

      try {
        const url = new URL(origin);
        const hostname = url.hostname.toLowerCase();

        // Allow Vercel preview/branch deployments from this team/project.
        if (url.protocol === 'https:' && hostname.endsWith('.vercel.app')) {
          if (hostname === 'ofix-completo.vercel.app') return true;

          const isSameVercelTeam = hostname.endsWith('-catgreens-projects.vercel.app');
          const isOfixProject =
            hostname.startsWith('ofix-completo-') ||
            hostname.startsWith('ofix-completo-git-') ||
            hostname.startsWith('pista-') ||
            hostname.startsWith('pista-git-');

          if (isSameVercelTeam && isOfixProject) return true;
        }
      } catch {
        // Ignore malformed origin strings.
      }

      if (process.env.NODE_ENV === 'development' && origin?.includes('localhost')) return true;

      return false;
    }

    const corsOptions = {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin || 'unknown-origin'}`));
        }
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
      optionsSuccessStatus: 204,
    };

    const activeCorsOptions = process.env.NODE_ENV === 'development'
      ? {
        origin: true,
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
        optionsSuccessStatus: 204,
      }
      : corsOptions;

    this.server.use(cors(activeCorsOptions));
    this.server.options('*', cors(activeCorsOptions));

    // Security headers
    this.server.use(securityHeaders);

    // Rate limiting in production only
    if (process.env.NODE_ENV === 'production') {
      this.server.use(rateLimit);
    }

    // Body parsing with strict payload limits
    this.server.use(express.json({ limit: '1mb' }));
    this.server.use(express.urlencoded({ extended: true, limit: '1mb' }));

    // Input sanitization
    this.server.use(sanitizeInput);

    // Request logging in development only
    if (process.env.NODE_ENV === 'development') {
      this.server.use((req, res, next) => {
        console.log(`Request received: ${req.method} ${req.url}`);
        next();
      });
    }
  }

  setupRoutes() {
    this.server.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        message: 'OFIX Backend funcionando!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      });
    });

    this.server.use('/api', routes);

    this.server.get('/', (req, res) => {
      res.json({ message: 'Bem-vindo a API OFIX!' });
    });
  }

  setupErrorHandler() {
    this.server.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      const isDev = process.env.NODE_ENV === 'development';

      if (isDev) {
        console.error(err.stack);
      } else {
        console.error(`[ERROR] ${req.method} ${req.path} - ${err.message || 'unknown'}`);
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

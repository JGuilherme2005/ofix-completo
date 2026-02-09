import { PrismaClient } from '@prisma/client';

// Instancia o Prisma Client
const prismaBase = new PrismaClient({
  // Opções de log (opcional, útil para desenvolvimento)
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Prisma middleware via `$use()` foi removido em versoes mais novas do Prisma.
// Use `$extends` para manter o comportamento (reconectar + retry em erros transientes).
const prisma = prismaBase.$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (error) {
          if (error?.code === 'P2024' || error?.code === 'P2021') {
            await prismaBase.$disconnect();
            await prismaBase.$connect();
            return await query(args);
          }
          throw error;
        }
      },
    },
  },
});
// Hook para fechar a conexão Prisma quando a aplicação encerrar (opcional, mas boa prática)
async function gracefulShutdown(signal) {
  console.log(`*${signal} recebido, fechando conexão Prisma...`);
  await prismaBase.$disconnect();
  console.log('Conexão Prisma fechada.');
  process.exit(0);
}

// Ouve por sinais de término para fechar a conexão Prisma
// process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl+C
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // `kill` command

export default prisma;

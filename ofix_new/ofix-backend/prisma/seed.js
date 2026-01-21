import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Criar hash da senha
  const passwordHash = await bcrypt.hash('admin123', 10)

  // 2. Criar ou Atualizar Usuário Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ofix.com' },
    update: {}, // Se já existe, não faz nada
    create: {
      email: 'admin@ofix.com',
      nome: 'Administrador OFIX',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Usuário criado: ${admin.email} (Senha: admin123)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

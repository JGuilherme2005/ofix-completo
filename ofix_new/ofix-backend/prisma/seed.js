import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // 1. Criar hash da senha
  const passwordHash = await bcrypt.hash('admin123', 10)

  // 2. Criar Oficina Matriz (se não existir)
  const oficina = await prisma.oficina.upsert({
    where: { cnpj: '00000000000100' }, // CNPJ Fictício para identificar
    update: {
      // Mantem a seed idempotente e garante que o chat-public possa validar slug/ativo.
      slug: 'ofix',
      isActive: true
    },
    create: {
      nome: 'Oficina Matriz (OFIX)',
      slug: 'ofix',
      isActive: true,
      cnpj: '00000000000100',
      endereco: 'Rua da Inovação, 100 - Tech City',
      telefone: '(11) 99999-9999'
    }
  })
  
  console.log(`🏢 Oficina garantida: ${oficina.nome} (ID: ${oficina.id})`)

  // 3. Criar ou Atualizar Usuário Admin vinculado à Oficina
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ofix.com' },
    update: {
      oficinaId: oficina.id // Garante que se o user já existe, ele ganha a oficina
    }, 
    create: {
      email: 'admin@ofix.com',
      nome: 'Administrador OFIX',
      password: passwordHash,
      role: 'ADMIN',
      oficinaId: oficina.id
    },
  })

  console.log(`✅ Usuário criado/atualizado: ${admin.email}`)
  console.log(`🔑 Senha: admin123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

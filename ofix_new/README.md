# ðŸ¢ OFIX - Sistema de GestÃ£o para Oficinas

Sistema completo de gestÃ£o para oficinas mecÃ¢nicas desenvolvido com React + Node.js.

## âœ¨ Funcionalidades

- ðŸ“Š **Dashboard** - VisÃ£o geral operacional com Kanban de OS
- ðŸ‘¥ **GestÃ£o de Clientes** - Cadastro e histÃ³rico completo
- ðŸš— **Controle de VeÃ­culos** - InformaÃ§Ãµes detalhadas dos veÃ­culos
- ðŸ“‹ **Ordens de ServiÃ§o** - CriaÃ§Ã£o e acompanhamento de OS
- ðŸ“¦ **Controle de Estoque** - GestÃ£o de peÃ§as e componentes
- ðŸ’° **Financeiro** - Controle de receitas e despesas
- ðŸ¤– **IA Integrada** - Assistente virtual para suporte

## ðŸš€ Demo Online

- **Frontend**: Em breve apÃ³s o deploy
- **Backend**: [https://ofix-backend-r556.onrender.com](https://ofix-backend-r556.onrender.com)

## ðŸ› ï¸ Tecnologias

### Frontend
- âš›ï¸ **React 18** - Interface de usuÃ¡rio
- ðŸŽ¨ **Tailwind CSS** - EstilizaÃ§Ã£o moderna
- ðŸš€ **Vite** - Build tool ultrarrÃ¡pido
- ðŸ“± **Responsive Design** - Mobile-first
- ðŸŽ­ **Framer Motion** - AnimaÃ§Ãµes fluidas
### Backend
- ðŸŸ¢ **Node.js + Express** - API RESTful robusta
- ðŸ—„ï¸ **PostgreSQL** - Banco de dados confiÃ¡vel
- ðŸ” **JWT Authentication** - AutenticaÃ§Ã£o segura
- ðŸ“¡ **CORS habilitado** - IntegraÃ§Ã£o frontend/backend
- â˜ï¸ **Deploy Render** - Hospedagem em nuvem

## ðŸ“¦ InstalaÃ§Ã£o e Uso

### PrÃ©-requisitos
- Node.js 18+ 
- npm ou yarn

### 1ï¸âƒ£ Clone o repositÃ³rio
```bash
git clone https://github.com/seu-usuario/ofix-frontend.git
cd ofix-frontend
```

### 2ï¸âƒ£ Instale as dependÃªncias
```bash
npm install
```

### 3ï¸âƒ£ Configure as variÃ¡veis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure a URL do backend
VITE_API_BASE_URL=https://ofix-backend-r556.onrender.com
```

### 4ï¸âƒ£ Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build para produÃ§Ã£o
npm run build

# Preview do build
npm run preview
```

## ðŸš€ Deploy Gratuito

Este projeto estÃ¡ configurado para deploy em plataformas gratuitas:

### Netlify (Recomendado)
1. Conecte seu repositÃ³rio GitHub
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`
4. Adicione as variÃ¡veis de ambiente

### Vercel
1. Importe o projeto do GitHub
2. As configuraÃ§Ãµes sÃ£o detectadas automaticamente
3. Adicione as variÃ¡veis de ambiente

## ðŸ“± Principais Telas

### ðŸ  Dashboard
- VisÃ£o geral em tempo real
- Kanban de Ordens de ServiÃ§o
- MÃ©tricas principais
- GrÃ¡ficos de performance

### ðŸ‘¤ GestÃ£o de Clientes
- Listagem com busca e filtros
- Cadastro completo
- HistÃ³rico de serviÃ§os
- InformaÃ§Ãµes de contato

### ðŸš— Controle de VeÃ­culos
- Cadastro de veÃ­culos
- VinculaÃ§Ã£o com clientes
- HistÃ³rico de manutenÃ§Ãµes
- Dados tÃ©cnicos

### ðŸ“‹ Ordens de ServiÃ§o
- CriaÃ§Ã£o automatizada
- Status em tempo real
- GestÃ£o de peÃ§as e serviÃ§os
- Controle de prazos

## ðŸ¤– IA Integrada

O sistema possui um assistente virtual inteligente que auxilia nas operaÃ§Ãµes:
- SugestÃµes de serviÃ§os
- AnÃ¡lise de padrÃµes
- Alertas automÃ¡ticos
- Suporte em tempo real

## ðŸ”§ Scripts DisponÃ­veis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produÃ§Ã£o
npm run preview    # Preview do build
npm run lint       # AnÃ¡lise de cÃ³digo
npm test           # Executa testes
```

## ðŸ“‚ Estrutura do Projeto

```
src/
â”œâ”€â”€ components/     # Componentes reutilizÃ¡veis
â”œâ”€â”€ pages/         # PÃ¡ginas da aplicaÃ§Ã£o
â”œâ”€â”€ services/      # APIs e serviÃ§os
â”œâ”€â”€ utils/         # UtilitÃ¡rios e helpers
â”œâ”€â”€ styles/        # Estilos globais
â””â”€â”€ assets/        # Imagens e recursos
```

## ðŸ¤ Contribuindo

1. FaÃ§a um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanÃ§as (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## ðŸ“„ LicenÃ§a

Este projeto estÃ¡ sob a licenÃ§a MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ðŸŒŸ Apoie o Projeto

Se este projeto foi Ãºtil para vocÃª, considere dar uma â­ no repositÃ³rio!

---

<div align="center">
  <p>Desenvolvido com â¤ï¸ para revolucionar a gestÃ£o de oficinas mecÃ¢nicas</p>
  <p>
    <a href="#-ofix---sistema-de-gestÃ£o-para-oficinas">Voltar ao topo</a>
  </p>
</div>

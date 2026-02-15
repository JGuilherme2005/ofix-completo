# AREA 8 - Frontend Core Architecture (Routing, Auth, API Clients, State)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `ofix_new/src/main.tsx`, `ofix_new/src/App.tsx`, `ofix_new/src/Layout.tsx`, Auth Context/ProtectedRoute, camada de API (`src/services/*`, `src/utils/*`, hooks de rede).

Objetivo desta area: validar arquitetura de roteamento + autenticacao + estrategia de chamadas HTTP + consistencia de estado (sem entrar em polimento de UI/UX ainda).

---

## Achados

### [FE-CORE-AUTH-01] Navegacao duplicada/concorrente no login (AuthProvider vs LoginPage)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/context/AuthContext.tsx` (funcao `login`) + `ofix_new/src/pages/LoginPage.tsx` (handleSubmit)
- **Diagnostico:** `AuthContext.login()` faz `navigate('/dashboard')`, mas `LoginPage` calcula `from` via `location.state?.from` e executa `navigate(from)`. Isso gera dois redirects em sequencia e torna o fluxo dependente de timing (e hoje pode ignorar o `from` caso a navegacao do provider aconteca primeiro).
- **Risco:** UX instavel (pisca/pula rota), e regressao facil quando rotas mudarem (ex: ao adicionar onboarding ou pagina "voltar para onde estava").
- **Correcao proposta:** mover a responsabilidade de redirect para **um** lugar:
  - opcao A: `AuthContext.login()` so autentica e retorna; a pagina decide para onde navegar.
  - opcao B: `AuthContext.login({ redirectTo })` respeita `from` e centraliza o redirect; a pagina apenas passa `from`.

### [FE-CORE-AUTH-02] Formato do `authToken` e consumo inconsistente (token+user vs tokenData com expiresAt/userId)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/src/services/auth.service.js` (salva `{ token, user }`) + `ofix_new/src/services/api.js` (le `authToken.token`) + `ofix_new/src/hooks/useAuthHeaders.js` (suporta `expiresAt`, `userId`) + `ofix_new/src/utils/logger.js` (tenta `tokenData.userId || tokenData.id`)
- **Diagnostico:** O projeto tem **mais de um "contrato"** para `localStorage.authToken`:
  - login salva `{ token, user }` (+ `localStorage.token` legacy),
  - hooks/utilitarios assumem campos como `expiresAt`, `userId`, `id` no nivel raiz.
  Resultado: funcionalidades que dependem desses campos (ex: logs com `userId`, futuros refresh tokens) ficam incoerentes.
- **Risco:** requests sem auth em pontos especificos, logs/telemetria sem userId, e bugs dificeis de rastrear quando alguem "normalizar" esse objeto em um lugar e quebrar outro.
- **Correcao proposta:** escolher e documentar **um** schema de token no frontend (ex: `{ token, user, expiresAt }`), criar helper unico (`getAuthToken()` / `getAuthHeaders()`), e **remover** leituras diretas (`localStorage.getItem('token')`) gradualmente.

### [FE-CORE-HTTP-01] Multiplos clients HTTP em paralelo (Axios + fetch + wrappers) com comportamentos divergentes
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/src/services/api.js` (axios + interceptors) + `ofix_new/src/services/ai.service.js` (fetch + AbortController) + `ofix_new/src/utils/api.js` (apiCall) + `ofix_new/src/utils/conversasAPI.js` (fetch + token legacy) + `ofix_new/src/pages/AIPage.tsx` (fetch direto) + `ofix_new/src/utils/logger.js` (fetch de logs)
- **Diagnostico:** Ha um "sprawl" de chamadas HTTP:
  - alguns caminhos injetam `Authorization` via axios interceptor,
  - outros reimplementam leitura do token,
  - outros nao enviam auth (ou usam `localStorage.token`),
  - timeouts, retries e tratamento de 401 sao diferentes.
- **Risco:** bugs intermitentes (uma feature funciona e outra quebra com 401), aumento de manutencao e superfice para regressao ao trocar backend URL/CORS.
- **Correcao proposta:** padronizar em **um** client:
  - ou Axios (recomendado aqui, ja existe) com helpers para timeout/retry por endpoint,
  - ou fetch wrapper unico com interceptors equivalentes.
  Em ambos os casos: `baseURL`, auth header, 401 handler e timeouts devem ser centralizados.

### [FE-CORE-HTTP-02] Estrategia de `baseURL` inconsistente (Render cross-origin vs caminhos relativos `/api/*`)
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/src/utils/api.js` (fallback `https://ofix-backend-r556.onrender.com`) + diversos `fetch('/api/...')` e `fetch('/agno/...')` em `src/components/*`, `src/hooks/*`, `src/pages/*`
- **Diagnostico:** Em dev, o Vite proxy resolve `/api` e `/agno` para `localhost:10000`. Em prod, parte do codigo usa `getApiBaseUrl()` (chamando Render diretamente), mas outra parte usa `'/api/...'` assumindo que o host atual (Vercel) vai reescrever/proxy esses paths.
- **Risco:** endpoints funcionam no local e quebram em producao (404/ CORS) dependendo de como o deploy foi configurado; alem disso, dificulta staging (preview vs prod) porque o fallback esta hardcoded.
- **Correcao proposta:** decidir e aplicar uma unica estrategia:
  - opcao A (recomendada): Vercel rewrites/proxy para o backend e frontend sempre chama `'/api'` e `'/agno'` (sem hardcode de host).
  - opcao B: frontend sempre chama `getApiBaseUrl()` e usa CORS estrito (com lista de origins por ambiente).
  Em qualquer opcao: remover o hardcode e exigir `VITE_API_BASE_URL` nos ambientes.

### [FE-CORE-STATE-01] Requests globais desnecessarios no `Layout` (fetch de dashboard/estoque em todas as rotas)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/Layout.tsx` (usa `useDashboardData()` e `useEstoqueData()` para painel/status)
- **Diagnostico:** `Layout` eh montado para todas as rotas autenticadas. Nele, hooks disparam requests (clientes, veiculos, servicos, pecas, fornecedores) mesmo quando o usuario nao esta no dashboard/estoque.
- **Risco:** latencia maior, custo de backend/DB, e degradacao em dispositivos fracos; em cenarios de cold start, isso pode piorar a sensacao de "sistema travado".
- **Correcao proposta:** isolar esse "status do sistema" em:
  - cache compartilhado (ex: React Query) com staleTime,
  - ou fetch sob demanda (carregar apenas quando o painel estiver visivel),
  - ou endpoint agregado leve (ex: `/api/metrics/summary`) para evitar N chamadas.

### [FE-CORE-ROUTER-01] `window.location.href` em navegacao interna (quebra SPA e perde estado)
- **Severidade:** P3
- **Arquivo/Local:** `ofix_new/src/Layout.tsx` (atalho Alt+M)
- **Diagnostico:** para abrir o Matias, o codigo usa `window.location.href = '/assistente-ia'` em vez de `navigate('/assistente-ia')`.
- **Risco:** reload completo, perda de estado, pior UX; em ambiente com service worker/pwa isso pode introduzir bugs.
- **Correcao proposta:** usar `useNavigate()` no Layout e trocar por navegacao SPA.

### [FE-CORE-DX-01] TSX migration parcial: muitos `@ts-nocheck` e importacao de `.js` em cadeia critica
- **Severidade:** P2
- **Arquivo/Local:** varios arquivos (ex: `ofix_new/src/pages/Dashboard.tsx`, `ofix_new/src/components/ai/VirtualAssistant.tsx`, etc.) + imports `.js` em `ofix_new/src/Layout.tsx` e `ofix_new/src/context/AuthContext.tsx`
- **Diagnostico:** o projeto tem TS configurado como `strict: true`, mas:
  - ha muitos arquivos TSX com `// @ts-nocheck`,
  - ha muitos modulos `.js` no caminho critico (auth/hooks/services) e tipagem "any".
  Na pratica, TypeScript nao esta cumprindo o papel de "rede de seguranca".
- **Risco:** bugs de runtime passando despercebidos, e a migracao para TSX vira apenas extensao de arquivo (sem ganhos reais).
- **Correcao proposta:** definir um plano incremental:
  - remover `@ts-nocheck` por modulo (com tickets pequenos),
  - tipar primeiro Auth/API contracts (onde o risco e maior),
  - criar tipos compartilhados (`src/types/*`) para `User`, `Servico`, `Cliente`, etc.

### [FE-CORE-UX-SYSTEM-01] Duplicacao de sistemas de Toast/Notification (hot-toast + shadcn toast + Toaster duplicado)
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/main.tsx` (`ToastProvider`) + `ofix_new/src/App.tsx` (`Toaster`) + `ofix_new/src/Layout.tsx` (`Toaster`) + uso misto de `toast` e `useToast`
- **Diagnostico:** existem pelo menos dois sistemas de notificacao em paralelo (react-hot-toast e o toast do design system), e o `Toaster` aparece mais de uma vez.
- **Risco:** notificacoes duplicadas/inconsistentes, estilos divergentes e maior complexidade para padronizar UX.
- **Correcao proposta:** escolher **um** sistema oficial e remover o outro gradualmente; manter **um** ponto de montagem global.

### [FE-CORE-DEAD-01] Codigo "quase-prod" nao referenciado: `src/agents/*`, `MatiasWidget*`, `useMatiasOffline`, wrappers antigos
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/agents/*` (sem imports), `ofix_new/src/components/ai/MatiasWidget*.tsx` (sem uso), `ofix_new/src/hooks/useMatiasOffline.js` (sem uso), `ofix_new/src/utils/api.js` (funcoes `chatWithMatias/testMatiasConnection` sem uso)
- **Diagnostico:** ha varios caminhos paralelos para "IA do Matias" e "assistente", mas a rota oficial parece ser `AIPage.tsx` + endpoints `/agno/*`. Os demais modulos ficam como superficie de manutencao e confundem contribuidores (alem de manterem chamadas a endpoints que podem nem existir).
- **Risco:** regressao acidental (alguem pluga o componente errado), aumento de bundle e tempo de build, e maior chance de vulnerabilidade (codigo antigo tende a ter menos hardening).
- **Correcao proposta:** apos unificar a arquitetura (fase de correcao), executar uma limpeza:
  - remover modulos nao usados ou mover para uma pasta `experimental/` fora do bundle,
  - documentar "qual eh o caminho oficial" para Matias (UI + API).

### [FE-CORE-API-LEGACY-01] Chamadas para endpoints possivelmente inexistentes/obsoletos
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/utils/api.js` (POST `apiCall("agno/chat-matias")`) + referencias a `/api/matias/*` em modulos nao usados
- **Diagnostico:** existem helpers que apontam para endpoints que nao aparecem como caminho oficial do backend atual (pelo menos na rota usada pelo `AIPage.tsx`, que usa `/agno/chat-inteligente`).
- **Risco:** funcionalidades "fantasma" (parece que existe, mas nao funciona), e tempo perdido debugando rotas que nunca foram integradas.
- **Correcao proposta:** inventariar endpoints reais do backend e alinhar os clients; remover helpers antigos ou reescrever com o contrato atual.

---

## Pontos positivos (para manter)
- `App.tsx` usa nested routes com `Layout` + `ProtectedRoute` e lazy loading por pagina (boa base).
- `AIPage.tsx` sanitiza HTML de resposta com `DOMPurify` e whitelist minima (boa postura de seguranca para chat).
- `getApiBaseUrl()` normaliza URL e remove trailing `/api`/`/` (boa para evitar double slashes).

---

## Recomendacao de proxima area
Se voce aprovar, a proxima etapa natural eh **AREA 9 (Frontend UI/UX + AI Interface)**, focando especificamente em:
- responsividade e bugs no desktop/mobile do `AIPage.tsx`,
- consistencia do design system (tokens, tipografia, contraste),
- acessibilidade (focus, teclado, ARIA) no chat e no painel lateral.


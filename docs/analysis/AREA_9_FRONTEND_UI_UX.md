# AREA 9 - Frontend UI/UX + AI Interface (AIPage / Matias)

Branch analisada: `feat/frontend-tsx-migration`  
Foco: `ofix_new/src/pages/AIPage.tsx` + componentes de chat (`ofix_new/src/components/chat/*`) + estilos Matias (`ofix_new/src/styles/matias-*.css`).

Objetivo desta area: avaliar responsividade (mobile/desktop), layout/scroll, acessibilidade (a11y), consistencia visual e DX de manutencao da UI do Assistente de IA.

---

## Achados

### [FE-UI-LAYOUT-01] Provavel bug de altura/scroll no desktop por cadeia de `h-full` sem pai com altura "definida" + wrapper sem `flex-1`
- **Severidade:** P1
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (root + wrapper `max-w-[1480px]` + grid `flex-1`) + `ofix_new/src/Layout.tsx` (`<Outlet />` dentro de `overflow-y-auto`)
- **Diagnostico:** O `AIPage` tenta ser uma tela "full height" com `h-full min-h-0 flex flex-col` e usa `flex-1`/`min-h-0` para permitir scroll interno do chat. Porem, o wrapper principal do conteudo (`mx-auto ... flex flex-col min-h-0`) **nao** tem `flex-1`, e o pai do `AIPage` (container do `<Outlet />`) nao fornece uma altura CSS "definida" (ele tem altura de flex item, mas `height` computado tende a ser `auto`).
- **Risco:** Em alguns tamanhos de tela/browsers, o chat pode:
  - nao preencher a altura disponivel (ficar "quebrado" ou com espaco morto),
  - perder scroll interno (mensagens empurram a pagina e vira scroll do app inteiro),
  - gerar double scroll (scroll do `Outlet` + scroll do chat).
- **Correcao proposta:** escolher uma estrategia consistente:
  - **Opcao A (preferida):** fazer o container do `Outlet` ser um layout de pagina (flex column) com `min-h-0`, e o `AIPage` usar `flex-1 min-h-0` (evitar depender de `h-full`).
  - **Opcao B:** no `AIPage`, garantir a cadeia de altura via `flex-1` no wrapper e/ou usar `min-h-[calc(...)]` para tornar a altura deterministica.
  - Regra pratica: evitar `h-full` em paginas dentro de containers com `overflow-y-auto`; preferir `flex-1 min-h-0`.

### [FE-UI-PANEL-01] Painel lateral (Matias) esta no caminho certo, mas a descoberta/controle no desktop pode ficar confusa
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (estado `painelFixoDesktop`, botao "Abrir painel" e `Sheet`)
- **Diagnostico:** O fluxo atual:
  - Desktop: painel fixo aparece por padrao (`matias_panel_pinned != "0"`) e tem botao para fechar.
  - Ao fechar, o botao "Abrir painel" (icone) fica disponivel; ao abrir, vira drawer (`Sheet`).
  - Para voltar a fixar no desktop, o usuario precisa abrir o drawer e clicar "Fixar".
  Funciona, mas e pouco obvio para o usuario ("por que virou drawer no desktop?").
- **Risco:** Usuario perde o painel e nao encontra como voltar; suporte/treinamento vira necessario. Em rollout para oficinas, isso vira atrito.
- **Correcao proposta:** manter o botao "Abrir painel" (como voce pediu), mas melhorar a UX:
  - No desktop, quando `painelFixoDesktop=false`, oferecer um **toggle direto** no header: "Painel: Off/On" (icone + label em `xl`), sem precisar abrir drawer.
  - Usar drawer (`Sheet`) como comportamento apenas para `lg-` (mobile/tablet), e no desktop abrir o painel fixo diretamente.

### [FE-UI-HEADER-01] Header do AIPage compete com o header global do app (espaco vertical e ruido visual), especialmente no mobile
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/Layout.tsx` (header global) + `ofix_new/src/pages/AIPage.tsx` (header gradiente interno)
- **Diagnostico:** A tela tem dois "headers" fortes: o do sistema (Layout) e o do AIPage (gradiente grande). No mobile isso consome altura e empurra o chat para baixo, aumentando a sensacao de "tela pequena".
- **Risco:** UX pior no chat (menos contexto visivel), mais scroll vertical desnecessario, e maior chance de overflow/wrap de controles.
- **Correcao proposta:** duas opcoes:
  - **Opcao A:** reduzir o header interno no mobile (ex: layout compacto, esconder subtitulo, agrupar botoes em menu).
  - **Opcao B:** mover parte dos indicadores (status/memoria/reconectar) para o painel lateral e deixar o header interno minimalista.

### [FE-UI-A11Y-01] A11y do chat: faltam semanticas e "live region" para novas mensagens; `alert()` nao e ideal
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (uso de `alert()` no fluxo de voz; lista de mensagens)
- **Diagnostico:** Hoje:
  - novas mensagens sao inseridas no DOM, mas nao ha `aria-live`/`role="log"` para leitores de tela,
  - `alert()` interrompe o fluxo e nao combina com o design system.
- **Risco:** acessibilidade ruim (teclado/leitor de tela), e UX "travada" em navegadores mobile.
- **Correcao proposta:** trocar `alert()` por toast padronizado e adicionar:
  - container de mensagens com `role="log"` e `aria-live="polite"` (ou `assertive` para erros),
  - foco controlado no input apos envio/acoes,
  - rotulos mais consistentes em botoes icon-only (ja tem varios `aria-label`, manter).

### [FE-UI-INPUT-01] Input de chat como `<Input>` limita mensagens longas e multiline; atalhos nao padronizados
- **Severidade:** P3
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (campo de mensagem)
- **Diagnostico:** Chat tende a precisar de multiline (explicacoes, listas). Com `<Input>`, o usuario nao consegue inserir quebras de linha e a edicao de mensagens longas fica ruim.
- **Risco:** mensagens piores, mais erros de digitacao, menos uso do assistente para tarefas "complexas".
- **Correcao proposta:** usar `Textarea` com autosize + atalho:
  - `Enter` envia,
  - `Shift+Enter` quebra linha,
  - manter contador de caracteres e warnings.

### [FE-UI-CONSISTENCY-01] Consistencia visual: excesso de gradientes/cores em mensagens e chips pode virar "UI barulhenta"
- **Severidade:** P3
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (message bubbles com multiplos gradientes por tipo) + `QUICK_SUGGESTION_CLASS`
- **Diagnostico:** O design esta "vivo" (bom), mas ha muitas variacoes simultaneas (gradientes por tipo + chips coloridos + header gradiente + background pattern). Isso pode reduzir legibilidade e parecer "denso".
- **Risco:** fadiga visual e dificuldade de escanear informacao (principalmente para mecanicos em ambiente de oficina).
- **Correcao proposta:** manter a direcao, mas limitar o numero de superficies em gradiente:
  - gradiente forte apenas no header e nas mensagens do usuario,
  - para tipos do assistente, usar fundos suaves (solid) + uma borda/acento (ex: left border color).

### [FE-UI-MEMORY-01] Card de Memoria mistura feature + instrucoes operacionais (Render) dentro da UI do usuario
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx` (`memoryCard`)
- **Diagnostico:** Quando memoria esta desativada, o card mostra instrucoes de deploy ("Configure no Render... Start Command..."). Isso e informacao tecnica exposta na UI do produto.
- **Risco:** confusao para usuarios nao tecnicos; e, para clientes finais no futuro, isso e vazamento de detalhes de infra.
- **Correcao proposta:** condicionar o conteudo:
  - para `role=ADMIN` mostrar instrucoes/diagnostico detalhado,
  - para demais usuarios mostrar apenas status + "fale com o administrador" (ou esconder totalmente).

### [FE-UI-PERF-01] `AIPage.tsx` monolitico (~2k linhas) mistura UI + estado + rede + voz + memoria
- **Severidade:** P2
- **Arquivo/Local:** `ofix_new/src/pages/AIPage.tsx`
- **Diagnostico:** Uma unica pagina concentra: requisicoes, parsing/sanitizacao, voz (speech), memoria, UI do painel, renderizacao do chat e logica de acoes. Isso aumenta o risco de regressao ao mexer em "qualquer coisa".
- **Risco:** bugfix lento/caro; onboard dificil; e refactors futuros ficam perigosos (principalmente com TS ainda parcial).
- **Correcao proposta:** quebrar em componentes e hooks com limites claros:
  - `useMatiasVoice()`, `useMatiasConnection()`, `useMatiasMemory()`, `ChatHeader`, `ChatList`, `ChatComposer`, `MatiasSidePanel`.

### [FE-UI-STYLE-01] Detalhe: typo em classe de animacao e prefer-reduced-motion pode nao cobrir tudo
- **Severidade:** P3
- **Arquivo/Local:** `ofix_new/src/styles/matias-animations.css` (`.matiaS-animate-status-online`)
- **Diagnostico:** Nome de classe com `S` maiusculo foge do padrao e reduz a efetividade de `prefers-reduced-motion` para aquele seletor.
- **Risco:** baixo, mas e um "paper cut" que indica drift nos estilos.
- **Correcao proposta:** normalizar o nome da classe (`.matias-...`) e garantir que os elementos realmente usem as classes esperadas.

---

## Pontos positivos (manter)
- Painel lateral com "Fixar/Colapsar" e persistencia em `localStorage` e uma boa ideia de produto (especialmente para desktop).
- Mensagens do assistente passam por sanitizacao (DOMPurify + allowlist minima) antes de renderizar HTML.
- Feedbacks de status (Fonte/latencia/run_id/cache) ajudam debug sem poluir demais a conversa.

---

## Proxima area sugerida
Se aprovado, a proxima etapa natural eh **AREA 10 (QA & Observability no Frontend)** focando em:
- testes unitarios de `AIPage` (sanitize/render), `useChatAPI`, `useAuthHeaders`,
- Playwright E2E para layout responsivo (desktop/mobile) e para o fluxo de painel/voice (sem depender do Agno online).


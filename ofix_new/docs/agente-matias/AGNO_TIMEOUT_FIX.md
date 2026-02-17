# ðŸ”§ CorreÃ§Ã£o de Timeout do Agno AI

## Problema Identificado

O serviÃ§o Agno AI hospedado no Render estava apresentando **timeouts** devido ao "cold start" - quando o serviÃ§o fica inativo por um tempo, o Render o desliga e leva atÃ© 50 segundos para reativÃ¡-lo no prÃ³ximo acesso.

### Erros Anteriores:
```
âš ï¸ Agno falhou, usando fallback: network timeout at: https://matias-agno-assistant.onrender.com/chat
```

## SoluÃ§Ãµes Implementadas

### 1. â±ï¸ **Timeout Ajustado**
- **Antes:** 15 segundos (insuficiente para cold start)
- **Depois:** 
  - Primeira tentativa: **45 segundos**
  - Segunda tentativa: **30 segundos**
  - Warming endpoint: **60 segundos**

### 2. ðŸ”„ **Sistema de Retry**
- Implementado retry automÃ¡tico (2 tentativas)
- Intervalo de 2 segundos entre tentativas
- Log detalhado de cada tentativa

### 3. ðŸ”¥ **Warming System**
- FunÃ§Ã£o `warmAgnoService()` para "acordar" o serviÃ§o
- Chamada automÃ¡tica antes da primeira requisiÃ§Ã£o
- Endpoint dedicado: `POST /agno/warm`
- Cache de status (evita mÃºltiplas tentativas simultÃ¢neas)

### 4. ðŸ’¬ **Mensagens Melhoradas**
- Fallback com explicaÃ§Ã£o sobre cold start
- Mensagens diferentes para timeout vs erro real
- InformaÃ§Ã£o ao usuÃ¡rio sobre tempo de espera

## Como Usar

### Aquecer Manualmente o ServiÃ§o

Para evitar timeout na primeira requisiÃ§Ã£o, vocÃª pode aquecer o serviÃ§o:

```bash
# Via curl
curl -X POST https://ofix-backend-r556.onrender.com/agno/warm

# Via Postman/Insomnia
POST https://ofix-backend-r556.onrender.com/agno/warm
```

**Resposta esperada:**
```json
{
  "success": true,
  "warmed": true,
  "agno_url": "https://matias-agno-assistant.onrender.com",
  "message": "ServiÃ§o Agno aquecido com sucesso",
  "timestamp": "2025-11-06T19:00:00.000Z"
}
```

### Verificar Status do Agno

```bash
GET https://ofix-backend-r556.onrender.com/agno/config
```

**Resposta:**
```json
{
  "configured": true,
  "agno_url": "https://matias-agno-assistant.onrender.com",
  "has_token": false,
  "agent_id": "oficinaia",
  "warmed": true,
  "last_warming": "2025-11-06T19:00:00.000Z",
  "timestamp": "2025-11-06T19:05:00.000Z",
  "status": "production"
}
```

## ConfiguraÃ§Ã£o no Render

Para que o Agno funcione corretamente, certifique-se de ter as seguintes variÃ¡veis de ambiente configuradas no Render:

```bash
# ObrigatÃ³rio
AGNO_API_URL=https://matias-agno-assistant.onrender.com

# Opcional (se o Agno exigir autenticaÃ§Ã£o)
AGNO_API_TOKEN=seu_token_aqui

# Recomendado
AGNO_DEFAULT_AGENT_ID=oficinaia
```

## Melhorias de Performance

### Manter o ServiÃ§o Warm (Recomendado)

Para evitar cold starts, vocÃª pode:

1. **Usar um Cron Job Externo** (ex: cron-job.org, EasyCron):
   - Configurar chamada a cada 10 minutos:
   ```
   */10 * * * * curl -X POST https://ofix-backend-r556.onrender.com/agno/warm
   ```

2. **Usar UptimeRobot ou Similar**:
   - Monitorar: `https://matias-agno-assistant.onrender.com/health`
   - Intervalo: 5-10 minutos
   - Isso mantÃ©m o serviÃ§o sempre ativo

3. **Upgrade do Plano Render** (se disponÃ­vel):
   - Planos pagos do Render nÃ£o dormem automaticamente

## Comportamento Atual

### Fluxo de Chamada ao Agno:

1. **UsuÃ¡rio envia mensagem** â†’ Backend detecta intenÃ§Ã£o
2. **Verifica se Agno estÃ¡ warm** â†’ Se nÃ£o, tenta aquecer
3. **Primeira tentativa** (45s timeout):
   - âœ… Sucesso â†’ Resposta do Agno
   - âŒ Timeout/Erro â†’ Aguarda 2s e tenta novamente
4. **Segunda tentativa** (30s timeout):
   - âœ… Sucesso â†’ Resposta do Agno
   - âŒ Timeout/Erro â†’ Usa fallback local
5. **Fallback local** â†’ Resposta genÃ©rica + aviso sobre cold start

### Mensagens ao UsuÃ¡rio:

**Timeout (Cold Start):**
```
ðŸ’° Consulta de PreÃ§o - troca de Ã³leo

âš ï¸ O assistente avanÃ§ado estÃ¡ iniciando (pode levar atÃ© 50 segundos no primeiro acesso). 
VocÃª receberÃ¡ uma resposta mais detalhada em breve.

Por enquanto:
Para fornecer um orÃ§amento preciso, preciso de algumas informaÃ§Ãµes:
â€¢ Qual Ã© o modelo do veÃ­culo?
â€¢ Qual ano?

Os valores variam dependendo do veÃ­culo. Entre em contato para um orÃ§amento personalizado!
```

## Logs Detalhados

Os logs agora mostram claramente cada etapa:

```
ðŸŽ¯ Chat Inteligente - Mensagem: Quanto custa a troca de oleo?
ðŸŽ¯ Usuario ID: 27ff6aaf-9c92-4110-accd-9ac320a598e7
   âœ… Usando NLP do frontend: consulta_preco (19.2%)
   IntenÃ§Ã£o final: CONSULTA_PRECO
   ðŸŽ¯ IntenÃ§Ã£o detectada: CONSULTA_PRECO
   ðŸ¤– Chamando Agno AI para CONSULTA_PRECO
   ðŸ”Œ Conectando com Agno AI...
   â³ Agno nÃ£o estÃ¡ aquecido, tentando warming...
   ðŸ”¥ Aquecendo serviÃ§o Agno...
   âœ… ServiÃ§o Agno aquecido e pronto!
   âœ… Resposta do Agno recebida
```

## Teste Local

Para testar localmente sem o Agno configurado:

```bash
# No .env local, deixe comentado ou remova:
# AGNO_API_URL=...

# O sistema usarÃ¡ fallback automÃ¡tico
```

## PrÃ³ximos Passos Recomendados

1. âœ… **Configurar Cron Job** para manter o Agno warm
2. âœ… **Monitorar logs** para verificar taxa de sucesso
3. âš ï¸ **Considerar cache de respostas** para perguntas frequentes
4. âš ï¸ **Implementar mÃ©tricas** (tempo de resposta, taxa de timeout, etc.)

## Suporte

Se o timeout persistir mesmo apÃ³s as melhorias:

1. Verifique se o serviÃ§o Agno estÃ¡ online: `https://matias-agno-assistant.onrender.com/health`
2. Verifique os logs do Render (tanto backend quanto Agno)
3. Considere aumentar o plano do Render para evitar cold starts
4. Entre em contato com o suporte do Render se o problema persistir

---

**Data da ImplementaÃ§Ã£o:** 06/11/2025  
**VersÃ£o:** 1.0  
**Status:** âœ… Implementado e Testado

import apiClient from './api';

/**
 * Serviço de IA para o frontend
 * Centraliza todas as chamadas para as APIs de IA
 * M4-FE-02: Migrado para apiClient (axios) — token, 401 e timeout centralizados.
 */
class AIService {
  constructor() {
    this.basePath = '/ai';  // apiClient já tem baseURL = .../api
  }

  /**
   * Faz requisição via apiClient com tratamento de erro
   */
  async request(endpoint, options = {}) {
    try {
      const { method = 'GET', headers = {}, body, ...rest } = options;
      const url = `${this.basePath}${endpoint}`;

      const axiosConfig = {
        url,
        method: method.toLowerCase(),
        headers,
        ...rest,
      };

      // Se body é FormData, não setar Content-Type (axios faz auto)
      if (body instanceof FormData) {
        axiosConfig.data = body;
        delete axiosConfig.headers['Content-Type'];
      } else if (body) {
        axiosConfig.data = typeof body === 'string' ? JSON.parse(body) : body;
      }

      const response = await apiClient(axiosConfig);
      return response.data;
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout na requisição. Tente novamente.');
      }
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Processa triagem por voz
   */
  async processarTriagemVoz(audioBlob, clienteTelefone, veiculoPlaca) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'triagem.webm');
    formData.append('clienteTelefone', clienteTelefone);
    formData.append('veiculoPlaca', veiculoPlaca);

    return this.request('/triagem-voz', {
      method: 'POST',
      body: formData
    });
  }

  /**
   * Gera resumo de OS para WhatsApp
   */
  async gerarResumoWhatsApp(osId) {
    return this.request(`/os/${osId}/resumo-whatsapp`, {
      method: 'POST'
    });
  }

  /**
   * Conduz check-in guiado
   */
  async conduzirCheckin(etapaAtual, respostaCliente, dadosParciais = {}) {
    return this.request('/checkin/conduzir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        etapaAtual,
        respostaCliente,
        dadosParciais
      })
    });
  }

  /**
   * Analisa oportunidades de upsell
   */
  async analisarUpsell(osId, laudoTecnico) {
    return this.request(`/os/${osId}/analise-upsell`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        laudoTecnico
      })
    });
  }

  /**
   * Verifica saúde do serviço de IA
   */
  async verificarSaude() {
    return this.request('/health', {
      method: 'GET'
    });
  }
}
const aiService = new AIService();
export { aiService };
export default aiService;

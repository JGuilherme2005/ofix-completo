import { useState, useEffect } from 'react';
import apiClient from '../services/api';

/**
 * 🔧 Hook para dados administrativos do Pista
 * Busca estatísticas reais do sistema
 */
export const useAdminData = () => {
    const [adminData, setAdminData] = useState({
        totalClientes: 0,
        totalVeiculos: 0,
        totalServicos: 0,
        totalUsuarios: 0,
        totalProcedimentos: 0,
        totalMensagens: 0,
        systemStatus: "Carregando...",
        lastUpdate: null,
        loading: true,
        error: null
    });

    const [refreshFlag, setRefreshFlag] = useState(0);

    // Função para forçar atualização dos dados
    const refreshData = () => {
        setRefreshFlag(prev => prev + 1);
    };

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setAdminData(prev => ({ ...prev, loading: true, error: null }));
                
                // Buscar dados de diferentes endpoints em paralelo
                const requests = [
                    apiClient.get(`/clientes`).catch(() => ({ data: [] })),
                    apiClient.get(`/servicos`).catch(() => ({ data: [] })),
                    apiClient.get(`/procedimentos`).catch(() => ({ data: [] })),
                    apiClient.get(`/mensagens`).catch(() => ({ data: [] }))
                ];

                const [clientesRes, servicosRes, procedimentosRes, mensagensRes] = await Promise.all(requests);

                // Calcular total de veículos
                const totalVeiculos = clientesRes.data.reduce((acc, cliente) => {
                    return acc + (cliente.veiculos?.length || 0);
                }, 0);

                setAdminData({
                    totalClientes: clientesRes.data.length || 0,
                    totalVeiculos: totalVeiculos,
                    totalServicos: servicosRes.data.length || 0,
                    totalUsuarios: 1, // Por enquanto, sempre 1 (usuário logado)
                    totalProcedimentos: procedimentosRes.data.length || 0,
                    totalMensagens: mensagensRes.data.length || 0,
                    systemStatus: "Online",
                    lastUpdate: new Date().toLocaleString('pt-BR'),
                    loading: false,
                    error: null
                });

            } catch (error) {
                console.error('❌ Erro ao buscar dados administrativos:', error);
                setAdminData(prev => ({
                    ...prev,
                    systemStatus: "Erro de Conexão",
                    loading: false,
                    error: error.message || 'Erro desconhecido'
                }));
            }
        };

        fetchAdminData();
    }, [refreshFlag]);

    return {
        ...adminData,
        refresh: refreshData,
        isOnline: adminData.systemStatus === "Online"
    };
};

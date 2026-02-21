import { useEffect, useState, useCallback, useRef } from "react";
import * as servicosService from '../services/servicos.service.js';
import { getAllClientes, getAllVeiculos } from '../services/clientes.service.js';
import toast from "react-hot-toast";

export default function useDashboardData() {
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState({});
  const [veiculos, setVeiculos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const errorToastShownRef = useRef({
    servicos: false,
    clientes: false,
    veiculos: false,
    geral: false,
  });

  const showErrorOnce = useCallback((key, message) => {
    if (errorToastShownRef.current[key]) return;
    errorToastShownRef.current[key] = true;
    toast.error(message);
  }, []);

  const clearErrorToastFlag = useCallback((key) => {
    errorToastShownRef.current[key] = false;
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [servicosResult, clientesResult, veiculosResult] = await Promise.allSettled([
        servicosService.getAllServicos(),
        getAllClientes(),
        getAllVeiculos(),
      ]);

      if (servicosResult.status === 'fulfilled') {
        setServicos(servicosResult.value || []);
        clearErrorToastFlag('servicos');
      } else {
        console.error('Erro ao carregar servicos:', servicosResult.reason);
        showErrorOnce('servicos', 'Falha ao carregar servicos.');
      }

      if (clientesResult.status === 'fulfilled') {
        const clientesMap = clientesResult.value.reduce((acc, cliente) => {
          acc[cliente.id] = cliente;
          return acc;
        }, {});
        setClientes(clientesMap);
        clearErrorToastFlag('clientes');
      } else {
        console.error('Erro ao carregar clientes:', clientesResult.reason);
        showErrorOnce('clientes', 'Falha ao carregar clientes.');
      }

      if (veiculosResult.status === 'fulfilled') {
        const veiculosMap = veiculosResult.value.reduce((acc, veiculo) => {
          acc[veiculo.id] = veiculo;
          return acc;
        }, {});
        setVeiculos(veiculosMap);
        clearErrorToastFlag('veiculos');
      } else {
        console.error('Erro ao carregar veiculos:', veiculosResult.reason);
        showErrorOnce('veiculos', 'Falha ao carregar veiculos.');
      }

      if (
        servicosResult.status === 'fulfilled' &&
        clientesResult.status === 'fulfilled' &&
        veiculosResult.status === 'fulfilled'
      ) {
        clearErrorToastFlag('geral');
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err.message || 'Falha ao carregar dados do dashboard.');
      showErrorOnce('geral', err.message || 'Falha ao carregar dados do dashboard.');
      setServicos([]);
    } finally {
      setIsLoading(false);
    }
  }, [clearErrorToastFlag, showErrorOnce]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    servicos,
    clientes,
    veiculos: Object.values(veiculos),
    isLoading,
    error,
    reload: loadData,
  };
}

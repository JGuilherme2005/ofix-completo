import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth.service.js'; // Nossos serviços de autenticação
import { useNavigate } from 'react-router-dom'; // Para redirecionamento programático

type AuthUser = {
  id?: string;
  nome?: string;
  email?: string;
  role?: string;
  isGuest?: boolean;
  [key: string]: any;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Para verificar o token inicial

  const navigate = useNavigate();

  // Função para carregar o usuário e token do localStorage na inicialização
  const loadUserFromStorage = useCallback(() => {
    setIsLoadingAuth(true);
    try {
      const storedData = authService.getCurrentUser(); // { user, token } ou null
      if (storedData && storedData.token && storedData.user) {
        const isGuest = storedData.user.email?.endsWith('@ofix.temp');
        setUser({ ...storedData.user, isGuest });
        setToken(storedData.token);
        setIsAuthenticated(true);
      } else {
        // Se não há token ou está malformado, garante que o estado esteja limpo
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        authService.logout(); // Limpa qualquer resquício no localStorage
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do storage:", error);
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      authService.logout();
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (credentials) => {
    setIsLoadingAuth(true);
    try {
      const data = await authService.login(credentials); // authService.login já salva no localStorage
      const isGuest = data.user.email?.endsWith('@ofix.temp');
      setUser({ ...data.user, isGuest });
      setToken(data.token);
      setIsAuthenticated(true);
      // M4-FE-04: redirect removido daqui — o componente chamador (LoginPage) decide o destino
      // para suportar redirect-back (from) corretamente.
      return data;
    } catch (error) {
      // Erro já logado pelo authService, aqui podemos apenas garantir estado limpo
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      authService.logout(); // Limpa localStorage
      throw error; // Relança para o componente de Login tratar (ex: toast)
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const register = async (userData) => {
    setIsLoadingAuth(true);
    try {
      const data = await authService.register(userData);
      // Após o registro, o usuário normalmente precisa fazer login
      // Pode-se optar por logar automaticamente ou redirecionar para a página de login
      // Aqui, apenas retornamos os dados e o componente de Registro decide o que fazer (ex: mostrar mensagem)
      return data;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout(); // Limpa o localStorage
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    navigate('/login'); // Redireciona para a página de login
  }, [navigate]);

  // M4-FE-04: O interceptor de API dispara 'auth:logout' ao receber 401.
  // Aqui apenas limpamos o estado React — o ProtectedRoute se encarrega de
  // redirecionar para /login com state.from, permitindo redirect-back após re-login.
  useEffect(() => {
    const onAuthLogout = () => {
      console.log("AuthContext: Recebido evento auth:logout (401). Limpando sessão.");
      authService.logout();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      // Não chamamos navigate aqui — o ProtectedRoute redireciona automaticamente
      // com state: { from: location }, preservando a rota original para redirect-back.
    };
    window.addEventListener('auth:logout', onAuthLogout);
    return () => {
      window.removeEventListener('auth:logout', onAuthLogout);
    };
  }, []);


  const value = {
    user,
    token,
    isAuthenticated,
    isLoadingAuth,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

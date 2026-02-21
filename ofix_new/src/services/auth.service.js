import apiClient from './api';

const AUTH_TOKEN_KEY = 'authToken';
const LEGACY_TOKEN_KEY = 'token';

function persistSession({ token, user }) {
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({ token, user }));
  // Keep legacy key in sync to avoid stale-token behavior from old builds/tabs.
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data && response.data.token && response.data.user) {
      persistSession({
        token: response.data.token,
        user: response.data.user,
      });
    }
    return response.data;
  } catch (error) {
    console.error('Erro no servico de login:', error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || 'Erro desconhecido no login.' };
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Erro no servico de registro:', error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || 'Erro desconhecido no registro.' };
  }
};

export const logout = () => {
  clearSession();
};

export const getCurrentUser = () => {
  const tokenDataString = localStorage.getItem(AUTH_TOKEN_KEY);

  if (tokenDataString) {
    try {
      return JSON.parse(tokenDataString);
    } catch (e) {
      console.error('Erro ao parsear dados de autenticacao do localStorage', e);
      clearSession();
      return null;
    }
  }

  // Legacy fallback: if only old key exists, ignore and clean it.
  if (localStorage.getItem(LEGACY_TOKEN_KEY)) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }

  return null;
};

export const getAuthToken = () => {
  const data = getCurrentUser();
  return data?.token ?? null;
};

export const isAuthenticated = () => {
  const currentUser = getCurrentUser();
  return !!currentUser?.token;
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || 'Erro ao buscar perfil.' };
  }
};

export const getInviteLink = async () => {
  try {
    const response = await apiClient.post('/auth/invite-link');
    const inviteUrl = `${window.location.origin}/invite?token=${response.data.token}`;
    return inviteUrl;
  } catch (error) {
    console.error('Erro ao gerar link de convite:', error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || 'Erro ao gerar convite.' };
  }
};

export const loginWithInvite = async (token) => {
  try {
    const response = await apiClient.post('/auth/guest-login', { token });
    if (response.data && response.data.token && response.data.user) {
      persistSession({
        token: response.data.token,
        user: response.data.user,
      });
    }
    return response.data;
  } catch (error) {
    console.error('Erro no login de convidado:', error.response?.data?.error || error.message);
    throw error.response?.data || { message: error.message || 'Erro ao entrar com convite.' };
  }
};

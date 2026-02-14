import prisma from '../config/database.js';
import * as authService from '../services/auth.service.js';

class AuthController {
  async register(req, res, next) {
    try {
      const {
        nomeUser,
        emailUser,
        passwordUser,
        nomeOficina,
        cnpjOficina,
        telefoneOficina,
        enderecoOficina,
      } = req.body;

      const normalizedCnpjOficina =
        typeof cnpjOficina === 'string' && cnpjOficina.trim() ? cnpjOficina.trim() : undefined;
      const normalizedTelefoneOficina =
        typeof telefoneOficina === 'string' && telefoneOficina.trim() ? telefoneOficina.trim() : undefined;
      const normalizedEnderecoOficina =
        typeof enderecoOficina === 'string' && enderecoOficina.trim() ? enderecoOficina.trim() : undefined;

      if (!nomeUser || !emailUser || !passwordUser || !nomeOficina) {
        return res.status(400).json({
          error:
            'Campos obrigatorios para registro nao fornecidos: nomeUser, emailUser, passwordUser, nomeOficina.',
        });
      }

      if (passwordUser.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
      }

      const newUser = await authService.registerUserAndOficina({
        nomeUser,
        emailUser,
        passwordUser,
        nomeOficina,
        cnpjOficina: normalizedCnpjOficina,
        telefoneOficina: normalizedTelefoneOficina,
        enderecoOficina: normalizedEnderecoOficina,
        userRole: 'GESTOR_OFICINA',
      });

      res.status(201).json({
        message: 'Usuario e oficina registrados com sucesso. Faca login para continuar.',
        user: newUser,
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({ error: 'Este e-mail ja esta em uso.' });
      }
      if (error.code === 'P2002' && error.meta?.target?.includes('cnpj')) {
        return res.status(409).json({ error: 'Este CNPJ ja esta em uso.' });
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha sao obrigatorios.' });
      }

      const loginResult = await authService.loginUser({ email, password });

      if (!loginResult) {
        return res.status(401).json({ error: 'Credenciais invalidas. Verifique e-mail e senha.' });
      }

      res.json(loginResult);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Nao autorizado ou token invalido.' });
      }

      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nome: true,
          email: true,
          role: true,
          oficinaId: true,
          createdAt: true,
          updatedAt: true,
          oficina: {
            select: {
              id: true,
              nome: true,
            },
          },
        },
      });

      if (!userProfile) {
        return res.status(404).json({ error: 'Usuario nao encontrado.' });
      }

      res.json({
        message: 'Perfil acessado com sucesso.',
        user: userProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateInviteLink(req, res, next) {
    try {
      const { oficinaId } = req.user;

      if (!oficinaId) {
        return res.status(400).json({ error: 'Usuario nao esta vinculado a uma oficina.' });
      }

      const token = await authService.createInviteToken(oficinaId);
      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async guestLogin(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: 'Token de convite e obrigatorio.' });
      }

      const result = await authService.processGuestLogin(token);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();

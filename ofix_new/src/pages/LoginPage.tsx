import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho
import { Wrench, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const emailInputRef = useRef<any>(null);

  const from = location.state?.from?.pathname || "/dashboard";

  // Auto-focus no campo de email quando a página carrega
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Função de validação de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler para mudança no email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Login bem-sucedido!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Falha no login:", error);
      toast.error(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <Card className="w-full max-w-md border-slate-200/80 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/95 dark:text-slate-100">
        <CardHeader className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Bem-vindo ao Pista</CardTitle>
          <p className="text-xs font-medium text-blue-600 tracking-wide mt-1">Plataforma Inteligente para Simplificar a Tarefa da Automecânica</p>
          <CardDescription className="mt-2 text-slate-600 dark:text-slate-300">
            Acesse sua conta para gerenciar sua oficina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-800 dark:text-slate-200">Email</Label>
              <Input
                ref={emailInputRef}
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="seu@email.com"
                required
                className={`text-base border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${emailError ? 'border-red-500' : ''}`}
              />
              {emailError && (
                <p className="text-sm text-red-600" role="alert">{emailError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-800 dark:text-slate-200">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="text-base border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            <Button type="submit" className="w-full text-base py-3 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
           <Button variant="link" className="text-blue-600 hover:text-blue-700" onClick={() => navigate('/register')}>
            Não tem uma conta? Registre-se
          </Button>
           {/* <Button variant="link" size="sm" className="text-slate-500 hover:text-slate-700 dark:text-slate-300">
            Esqueceu sua senha?
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}

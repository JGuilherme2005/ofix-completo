import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    DollarSign,
    Settings,
    Brain,
    Wrench,
    Bell,
    LogOut,
    X,
    AlertTriangle,
    ChevronRight,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./context/AuthContext";
import useDashboardData from "./hooks/useDashboardData.js";
import { useEstoqueData } from "./hooks/useEstoqueData.js";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import VirtualAssistant from './components/ai/VirtualAssistant';
import { ThemeToggle } from "./components/ui/ThemeToggle";

// --- Constantes ---
const NAVIGATION_ITEMS = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, badge: null },
    { title: "Clientes", url: "/clientes", icon: Users, badge: null },
    { title: "Estoque", url: "/estoque", icon: Package, badge: null },
    { title: "Financeiro", url: "/financeiro", icon: DollarSign, badge: null },
    { title: "Assistente IA", url: "/assistente-ia", icon: Brain, badge: "IA" },
    { title: "Configurações", url: "/configuracoes", icon: Settings, badge: null },
];

const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/clientes": "Clientes",
    "/estoque": "Estoque",
    "/financeiro": "Financeiro",
    "/assistente-ia": "Assistente IA",
    "/configuracoes": "Configurações",
};

const PAGE_SUBTITLES: Record<string, string> = {
    "/dashboard": "Visão geral operacional",
    "/clientes": "Gestão de clientes",
    "/estoque": "Controle de peças",
    "/financeiro": "Gestão financeira",
    "/assistente-ia": "Inteligência artificial",
    "/configuracoes": "Configurações do sistema",
};

const USER_ROLES = {
    MECANICO: ['MECAN', 'TECNICO', 'OFICIAL'],
    ADMIN: ['ADMIN', 'GERENTE', 'SUPER']
};

// --- Subcomponentes ---
const HeaderBranding = () => (
    <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
                <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900"></div>
        </div>
        <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                P.I.S.T.A
            </h1>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-tight mt-1 max-w-[220px]">
                Plataforma Inteligente para Simplificar a Tarefa da Automecânica
            </p>
        </div>
    </div>
);

const SystemStatusPanel = ({ servicos, pecas, onEstoqueBaixoClick }: { servicos: any; pecas: any; onEstoqueBaixoClick: () => void }) => {

    const servicosAtivos = useMemo(() => {
        if (!servicos) return 0;
        return servicos.filter((servico: any) => servico.status !== 'FINALIZADO').length;
    }, [servicos]);

    const estoqueBaixo = useMemo(() => {
        if (!pecas) return 0;
        return pecas.filter((peca: any) => {
            const quantidade = Number(peca.quantidade || peca.estoqueAtual || 0);
            const estoqueMinimo = Number(peca.estoqueMinimo || 0);
            return quantidade <= estoqueMinimo;
        }).length;
    }, [pecas]);

    return (
        <div className="px-3 mt-6">
            <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Status
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 transition-colors">
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Serviços Ativos</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2.5 py-0.5 rounded-full tabular-nums">
                        {servicosAtivos}
                    </span>
                </div>
                <button
                    onClick={onEstoqueBaixoClick}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 hover:bg-amber-100/80 dark:hover:bg-amber-950/40 transition-all duration-200 group"
                >
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">Estoque Baixo</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-0.5 rounded-full tabular-nums">
                            {estoqueBaixo}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </div>
                </button>
            </div>
        </div>
    );
};

const UserPanel = ({ user, isAuthenticated, isLoadingAuth, logout }: { user: any; isAuthenticated: boolean; isLoadingAuth: boolean; logout: () => void }) => (
    <div className="flex items-center gap-3 p-3">
        <div className="relative flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                    {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                </span>
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-50 dark:border-slate-900 ${isAuthenticated ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
        </div>
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate leading-tight">
                {isLoadingAuth ? "Carregando..." : (isAuthenticated && user?.nome ? user.nome : "Visitante")}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight">
                {isAuthenticated && user?.role
                    ? user.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())
                    : "Não autenticado"}
            </p>
        </div>
        {isAuthenticated && (
            <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Sair"
                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200"
            >
                <LogOut className="w-4 h-4" />
            </Button>
        )}
    </div>
);

// --- Componente principal ---
export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, isLoadingAuth } = useAuth();
    const [showEstoqueBaixoModal, setShowEstoqueBaixoModal] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const { pecas } = useEstoqueData();
    const { servicos } = useDashboardData();
    const isAIAssistantPage = location.pathname.startsWith('/assistente-ia');

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotificationsDropdown && !event.target.closest('.notifications-container')) {
                setShowNotificationsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotificationsDropdown]);

    // Calcular peças com estoque baixo para o modal
    const pecasEstoqueBaixo = useMemo(() => {
        if (!pecas) return [];
        return pecas.filter(peca => {
            const quantidade = Number(peca.quantidade || peca.estoqueAtual || 0);
            const estoqueMinimo = Number(peca.estoqueMinimo || 0);
            return quantidade <= estoqueMinimo;
        });
    }, [pecas]);

    // Calcular notificações (peças com estoque baixo + serviços atrasados)
    const notificationsCount = useMemo(() => {
        let count = 0;

        // Contar peças com estoque baixo
        if (pecasEstoqueBaixo) {
            count += pecasEstoqueBaixo.length;
        }

        // Contar serviços atrasados (exemplo: mais de 7 dias)
        if (servicos) {
            const servicosAtrasados = servicos.filter(servico => {
                if (servico.status === 'FINALIZADO') return false;
                const dataInicio = new Date(servico.dataInicio || servico.createdAt);
                const hoje = new Date();
                const diasDiferenca = (hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24);
                return diasDiferenca > 7;
            });
            count += servicosAtrasados.length;
        }

        return count;
    }, [pecasEstoqueBaixo, servicos]);

    // Determina tipo de usuário com useMemo
    const userTypeForAssistant = useMemo(() => {
        const role = (user?.role || '').toUpperCase();
        if (USER_ROLES.MECANICO.some(kw => role.includes(kw))) return 'mecanico';
        if (USER_ROLES.ADMIN.some(kw => role.includes(kw))) return 'admin';
        return 'cliente';
    }, [user?.role]);

    // Atalhos de teclado globais
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Alt + M: Abrir Matias
            if (e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                if (!location.pathname.startsWith('/assistente-ia')) {
                    navigate('/assistente-ia');
                }
            }
            // Alt + H: Mostrar atalhos (Help)
            if (e.altKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                toast(
                    <div className="text-sm">
                        <p className="font-bold mb-2">⌨️ Atalhos Disponíveis:</p>
                        <p><kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Alt+M</kbd> Abrir Matias</p>
                        <p><kbd className="px-2 py-1 bg-slate-200 rounded text-xs">Alt+H</kbd> Mostrar atalhos</p>
                    </div>,
                    { duration: 4000 }
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [location.pathname]);

    return (
        <SidebarProvider defaultOpen={true}>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    className: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 dark:text-slate-100',
                    style: { background: undefined, color: undefined },
                    success: { duration: 3000 },
                    error: { duration: 4000 }
                } as any}
            />

            <div className="h-dvh w-full bg-slate-50 dark:bg-slate-950 flex flex-col supports-[height:100dvh]:h-dvh">

                {/* Header Global — Glassmorphism */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 z-header flex-shrink-0 sticky top-0">
                    <div className="flex items-center justify-between h-16 px-4 md:px-6">
                        {/* Esquerda: Trigger mobile + Branding */}
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center" />
                            <HeaderBranding />
                        </div>

                        {/* Direita: Ações */}
                        <div className="flex items-center gap-1">
                            <ThemeToggle />

                            {/* Notificações */}
                            <div className="relative notifications-container">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                                    aria-label="Notificações"
                                    aria-expanded={showNotificationsDropdown}
                                    className="h-9 w-9 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
                                >
                                    <Bell className="w-[18px] h-[18px]" />
                                </Button>

                                {notificationsCount > 0 && (
                                    <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-slate-900">
                                        {notificationsCount > 99 ? '99+' : notificationsCount}
                                    </div>
                                )}

                                        {/* Dropdown de Notificações */}
                                        {showNotificationsDropdown && (
                                            <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/80 dark:border-slate-700 z-dropdown">
                                                <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-700/50">
                                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notificações</h3>
                                                    <button
                                                        onClick={() => setShowNotificationsDropdown(false)}
                                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-150"
                                                        aria-label="Fechar notificações"
                                                    >
                                                        <X className="w-3.5 h-3.5 text-slate-400" />
                                                    </button>
                                                </div>

                                                <div className="max-h-80 overflow-y-auto">
                                                    {notificationsCount > 0 ? (
                                                        <div className="p-1.5">
                                                            {pecasEstoqueBaixo.length > 0 && (
                                                                <div className="space-y-0.5">
                                                                    <div className="px-3 py-1.5 text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                                                                        Estoque Baixo ({pecasEstoqueBaixo.length})
                                                                    </div>
                                                                    {pecasEstoqueBaixo.slice(0, 3).map((peca: any, index: number) => (
                                                                        <button
                                                                            key={peca.id || index}
                                                                            onClick={() => {
                                                                                setShowNotificationsDropdown(false);
                                                                                setShowEstoqueBaixoModal(true);
                                                                            }}
                                                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg cursor-pointer transition-colors duration-150 text-left"
                                                                        >
                                                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">
                                                                                    {peca.nome || peca.descricao || 'Peça sem nome'}
                                                                                </p>
                                                                                <p className="text-[11px] text-slate-400">
                                                                                    Estoque: {Number(peca.quantidade || peca.estoqueAtual || 0)} / Mín: {Number(peca.estoqueMinimo || 0)}
                                                                                </p>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                    {pecasEstoqueBaixo.length > 3 && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setShowNotificationsDropdown(false);
                                                                                setShowEstoqueBaixoModal(true);
                                                                            }}
                                                                            className="w-full p-2 text-center text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg cursor-pointer transition-colors duration-150"
                                                                        >
                                                                            Ver mais {pecasEstoqueBaixo.length - 3} peças...
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {servicos && servicos.filter((servico: any) => {
                                                                const dataInicio = new Date(servico.dataInicio);
                                                                const hoje = new Date();
                                                                const diasDecorridos = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
                                                                return servico.status !== 'FINALIZADO' && diasDecorridos > 7;
                                                            }).length > 0 && (
                                                                    <div className="space-y-0.5 mt-2">
                                                                        <div className="px-3 py-1.5 text-[11px] font-semibold text-red-500 uppercase tracking-wider">
                                                                            Serviços Atrasados
                                                                        </div>
                                                                        {servicos.filter((servico: any) => {
                                                                            const dataInicio = new Date(servico.dataInicio);
                                                                            const hoje = new Date();
                                                                            const diasDecorridos = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
                                                                            return servico.status !== 'FINALIZADO' && diasDecorridos > 7;
                                                                        }).slice(0, 2).map((servico: any, index: number) => {
                                                                            const dataInicio = new Date(servico.dataInicio);
                                                                            const hoje = new Date();
                                                                            const diasDecorridos = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
                                                                            return (
                                                                                <div
                                                                                    key={servico.id || index}
                                                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors duration-150"
                                                                                >
                                                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">
                                                                                            OS #{servico.numeroOS || servico.id}
                                                                                        </p>
                                                                                        <p className="text-[11px] text-slate-400">
                                                                                            {diasDecorridos} dias em andamento
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 text-center">
                                                            <Bell className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                                                            <p className="text-slate-400 text-xs">Nenhuma notificação</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {notificationsCount > 0 && (
                                                    <div className="p-2 border-t border-slate-100 dark:border-slate-700/50">
                                                        <button
                                                            onClick={() => setShowNotificationsDropdown(false)}
                                                            className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1.5 transition-colors duration-150"
                                                        >
                                                            Fechar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Separator + User avatar no header */}
                                    {isAuthenticated && (
                                        <>
                                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                                            <button
                                                onClick={logout}
                                                className="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 group"
                                                aria-label="Sair da conta"
                                            >
                                                <div className="w-7 h-7 bg-gradient-to-br from-slate-600 to-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-semibold">
                                                        {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                                                    </span>
                                                </div>
                                                <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 transition-colors" />
                                            </button>
                                        </>
                                    )}
                                </div>
                        </div>
                </header>

                {/* Container com Sidebar + Conteúdo */}
                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar — Design moderno */}
                    <Sidebar className="border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 z-sidebar w-64 flex-shrink-0 fixed h-[calc(100dvh-4rem)] top-16 left-0 hidden md:flex md:flex-col" role="navigation" aria-label="Menu principal">
                        <SidebarContent className="px-3 pt-4 flex-1 overflow-y-auto">
                            {/* Menu de navegação */}
                            <SidebarGroup>
                                <SidebarGroupLabel className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-1">
                                    Menu
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu className="space-y-0.5">
                                        {NAVIGATION_ITEMS.map((item) => {
                                            const isActive = location.pathname === item.url;
                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        className={`rounded-xl transition-all duration-200 group ${isActive
                                                            ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 shadow-sm shadow-blue-100/50 dark:shadow-blue-950/20'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                                            }`}
                                                    >
                                                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                                                            <div className={`p-1.5 rounded-lg transition-all duration-200 ${isActive
                                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                                                                }`}>
                                                                <item.icon className="w-4 h-4" />
                                                            </div>
                                                            <span className={`text-[13px] font-medium flex-1 ${isActive ? 'font-semibold' : ''}`}>
                                                                {item.title}
                                                            </span>
                                                            {item.badge && (
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                                                }`}>
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            {isActive && (
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SystemStatusPanel
                                servicos={servicos}
                                pecas={pecas}
                                onEstoqueBaixoClick={() => setShowEstoqueBaixoModal(true)}
                            />
                        </SidebarContent>

                        <SidebarFooter className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                            <UserPanel
                                user={user}
                                isAuthenticated={isAuthenticated}
                                isLoadingAuth={isLoadingAuth}
                                logout={logout}
                            />
                        </SidebarFooter>
                    </Sidebar>

                    {/* Conteúdo principal */}
                    <main className="flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className={`flex-1 ${isAIAssistantPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                            {/* Título da página acima do conteúdo */}
                            {!isAIAssistantPage && (
                                <div className="px-4 md:px-6 pt-5 pb-2">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">
                                        {PAGE_TITLES[location.pathname] || "Página"}
                                    </h2>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                        {PAGE_SUBTITLES[location.pathname] || ""}
                                    </p>
                                </div>
                            )}
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            {/* Assistente virtual — COMENTADO TEMPORARIAMENTE */}
            {/* {isAuthenticated && (
                <VirtualAssistant
                    userType={userTypeForAssistant}
                    initialContext={{
                        userId: user?.id,
                        userName: user?.nome,
                        role: user?.role || 'cliente'
                    }}
                />
            )} */}

            {/* Botão Flutuante Matias */}
            {isAuthenticated && !location.pathname.startsWith('/assistente-ia') && (
                <Link
                    to="/assistente-ia"
                    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-fab transition-all duration-200 group"
                    aria-label="Abrir Assistente Matias"
                >
                    <Brain className="w-6 h-6 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="w-2 h-2 bg-white dark:bg-slate-900 rounded-full animate-pulse"></span>
                    </span>
                    <div className="absolute bottom-full mb-2 right-0 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Matias IA (Alt+M)
                    </div>
                </Link>
            )}

            {/* Modal de Estoque Baixo - Overlay Global */}
            {showEstoqueBaixoModal && (
                <div className="fixed inset-0 bg-black/50 z-modal-backdrop flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        {/* Header do Modal */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                        Peças com Estoque Baixo
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        {pecasEstoqueBaixo.length} {pecasEstoqueBaixo.length === 1 ? 'peça precisa' : 'peças precisam'} de reposição
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEstoqueBaixoModal(false)}
                                className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors duration-200"
                                aria-label="Fechar modal de estoque baixo"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="p-6 overflow-y-auto max-h-96">
                            {pecasEstoqueBaixo.length > 0 ? (
                                <div className="space-y-3">
                                    {pecasEstoqueBaixo.map((peca, index) => {
                                        const quantidade = Number(peca.quantidade || peca.estoqueAtual || 0);
                                        const estoqueMinimo = Number(peca.estoqueMinimo || 0);
                                        return (
                                            <div
                                                key={peca.id || index}
                                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                                        {peca.nome || peca.descricao || 'Peça sem nome'}
                                                    </h4>
                                                    <p className="text-sm text-slate-600">
                                                        Código: {peca.codigo || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-orange-600">
                                                        Atual: {quantidade}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Mínimo: {estoqueMinimo}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600">Nenhuma peça com estoque baixo encontrada.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer do Modal */}
                        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="text-sm text-slate-600">
                                📝 Dica: Considere repor essas peças o quanto antes
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowEstoqueBaixoModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-200 transition-colors duration-200"
                                >
                                    Fechar
                                </button>
                                <Link
                                    to="/estoque"
                                    onClick={() => setShowEstoqueBaixoModal(false)}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Ver Estoque
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarProvider>
    );
}

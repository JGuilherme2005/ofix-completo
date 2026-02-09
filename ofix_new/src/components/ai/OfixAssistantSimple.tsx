// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { 
    MessageSquare, X, Send, User, Wrench, Search, 
    Clock, AlertCircle, CheckCircle, Calendar, 
    Package, Car, FileText, DollarSign, Settings,
    Minimize2, Maximize2, Volume2, VolumeX, Copy,
    Phone, Mail, MapPin, TrendingUp
} from 'lucide-react';

const OfixAssistantSimple = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Olá! Sou o assistente virtual da OFIX. Como posso ajudá-lo hoje?',
            timestamp: new Date(),
            suggestions: [
                { icon: Search, text: 'Consultar OS', action: 'consultar_os' },
                { icon: Calendar, text: 'Agendar Serviço', action: 'agendar' },
                { icon: Package, text: 'Consultar Peças', action: 'consultar_pecas' },
                { icon: Car, text: 'Meu Veículo', action: 'meu_veiculo' }
            ]
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const messagesEndRef = useRef<any>(null);
    const inputRef = useRef<any>(null);

    // Predefined responses for automotive context
    const autoResponses = {
        'consultar_os': {
            content: 'Para consultar sua Ordem de Serviço, posso ajudar de algumas formas:\n\n🔍 **Consultar por número da OS**\n📱 **Consultar por placa do veículo**\n📞 **Consultar por telefone cadastrado**\n\nInforme o número da OS ou a placa do seu veículo.',
            suggestions: [
                { icon: FileText, text: 'OS #12345', action: 'os_especifica' },
                { icon: Car, text: 'Placa ABC-1234', action: 'consultar_placa' },
                { icon: Phone, text: 'Por telefone', action: 'consultar_telefone' }
            ]
        },
        'agendar': {
            content: '📅 **Agendamento de Serviços**\n\nTemos horários disponíveis para:\n\n🔧 **Manutenção Preventiva** - Próxima vaga: Amanhã 14h\n⚠️ **Serviços de Emergência** - Hoje mesmo\n🔍 **Diagnóstico** - Hoje 16h\n\nQue tipo de serviço você precisa?',
            suggestions: [
                { icon: Settings, text: 'Manutenção', action: 'manutencao' },
                { icon: AlertCircle, text: 'Emergência', action: 'emergencia' },
                { icon: Search, text: 'Diagnóstico', action: 'diagnostico' },
                { icon: Calendar, text: 'Ver Agenda', action: 'ver_agenda' }
            ]
        },
        'consultar_pecas': {
            content: '📦 **Consulta de Peças**\n\nPosso verificar:\n\n✅ **Disponibilidade** em estoque\n💰 **Preços** atualizados\n🚚 **Prazo de entrega** se não estiver em estoque\n📋 **Compatibilidade** com seu veículo\n\nInforme a peça que procura ou o modelo do seu veículo.',
            suggestions: [
                { icon: Search, text: 'Buscar Peça', action: 'buscar_peca' },
                { icon: Car, text: 'Por Veículo', action: 'pecas_veiculo' },
                { icon: TrendingUp, text: 'Mais Vendidas', action: 'pecas_populares' },
                { icon: DollarSign, text: 'Promoções', action: 'promocoes' }
            ]
        },
        'meu_veiculo': {
            content: '🚗 **Informações do Veículo**\n\nPara acessar as informações do seu veículo, informe:\n\n🆔 **Placa** do veículo\n📱 **CPF** do proprietário\n\nCom esses dados posso mostrar:\n• Histórico de serviços\n• Próximas manutenções\n• Status atual do veículo',
            suggestions: [
                { icon: Car, text: 'ABC-1234', action: 'info_veiculo' },
                { icon: FileText, text: 'Histórico', action: 'historico_veiculo' },
                { icon: Calendar, text: 'Próximas Manutenções', action: 'proximas_manutencoes' },
                { icon: AlertCircle, text: 'Alertas', action: 'alertas_veiculo' }
            ]
        },
        'os_especifica': {
            content: '📋 **OS #12345 - Honda Civic 2020**\n\n**Status:** 🟡 Em Andamento\n**Cliente:** João Silva\n**Entrada:** 15/01/2024\n**Previsão:** 17/01/2024\n\n**Serviços:**\n✅ Troca de óleo - Concluído\n🔄 Alinhamento - Em andamento\n⏳ Balanceamento - Aguardando\n\n**Valor Total:** R$ 380,00',
            suggestions: [
                { icon: Phone, text: 'Ligar para Oficina', action: 'ligar_oficina' },
                { icon: Calendar, text: 'Reagendar', action: 'reagendar' },
                { icon: DollarSign, text: 'Detalhes Financeiros', action: 'detalhes_financeiros' }
            ]
        },
        'emergencia': {
            content: '🚨 **Serviço de Emergência**\n\n**Atendimento 24h disponível para:**\n• Pane elétrica\n• Superaquecimento\n• Problema no freio\n• Não liga\n\n📞 **Telefone Emergência:** (11) 99999-9999\n📍 **Guincho:** Disponível na região\n\n**Onde você está?**',
            suggestions: [
                { icon: Phone, text: 'Ligar Agora', action: 'ligar_emergencia' },
                { icon: MapPin, text: 'Solicitar Guincho', action: 'solicitar_guincho' },
                { icon: AlertCircle, text: 'Descrição do Problema', action: 'descrever_problema' }
            ]
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const playNotificationSound = () => {
        if (soundEnabled) {
            // Simple beep sound using Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (error) {
                console.log('Audio not supported');
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (messageText = null, action = null) => {
        const text = messageText || inputMessage.trim();
        if (!text && !action) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const response = autoResponses[action] || {
                content: `Entendi que você quer "${text}". Nossa equipe irá processar sua solicitação.\n\n📞 **Contato Direto:** (11) 3333-4444\n📧 **Email:** contato@ofix.com.br\n⏰ **Horário:** Seg-Sex 8h às 18h, Sáb 8h às 12h`,
                suggestions: [
                    { icon: Phone, text: 'Falar com Atendente', action: 'falar_atendente' },
                    { icon: Search, text: 'Nova Consulta', action: 'nova_consulta' },
                    { icon: FileText, text: 'Menu Principal', action: 'menu_principal' }
                ]
            };

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: response.content,
                timestamp: new Date(),
                suggestions: response.suggestions
            };

            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            playNotificationSound();
        }, 1000 + Math.random() * 1000);
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion.text, suggestion.action);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            playNotificationSound();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg
                    bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                    hover:from-blue-700 hover:to-blue-800 transition-all duration-300
                    transform hover:scale-110 active:scale-95
                    ${isOpen ? 'scale-0' : 'scale-100'}`}
                style={{
                    transform: isOpen ? 'scale(0)' : 'scale(1)',
                    transition: 'transform 0.3s ease'
                }}
            >
                <MessageSquare className="w-7 h-7 mx-auto" />
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full 
                    animate-pulse flex items-center justify-center">
                    <span className="text-xs font-bold text-white">!</span>
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed bottom-6 right-6 z-40 bg-white rounded-2xl shadow-2xl
                        border border-slate-200 overflow-hidden
                        ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} transition-all duration-300
                        animate-in slide-in-from-bottom-8 fade-in-0`}
                    style={{
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Wrench className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Assistente OFIX</h3>
                                    <p className="text-xs text-blue-100">
                                        {isTyping ? 'Digitando...' : 'Online • Pronto para ajudar'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] bg-gradient-to-b from-slate-50 to-white">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}
                                            animate-in slide-in-from-bottom-2 fade-in-0`}
                                        style={{
                                            animation: 'slideInMessage 0.3s ease-out'
                                        }}
                                    >
                                        <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                                            <div className={`p-3 rounded-2xl ${
                                                message.type === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto'
                                                    : 'bg-white border border-slate-200 shadow-sm'
                                            }`}>
                                                <div className="text-sm leading-relaxed whitespace-pre-line">
                                                    {message.content}
                                                </div>
                                                <div className={`text-xs mt-2 ${
                                                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                                                }`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {message.type === 'bot' && (
                                                        <button
                                                            onClick={() => copyToClipboard(message.content)}
                                                            className="ml-2 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Copy className="w-3 h-3 inline" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Suggestions */}
                                            {message.suggestions && (
                                                <div className="mt-3 space-y-2">
                                                    {message.suggestions.map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            className="flex items-center gap-2 w-full p-2 text-sm bg-gradient-to-r from-slate-50 to-slate-100 
                                                                hover:from-blue-50 hover:to-blue-100 border border-slate-200 hover:border-blue-300 
                                                                rounded-lg transition-all duration-200 text-slate-700 hover:text-blue-700
                                                                transform hover:scale-102 active:scale-98"
                                                        >
                                                            <suggestion.icon className="w-4 h-4 flex-shrink-0" />
                                                            <span>{suggestion.text}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.type === 'user' ? 'order-2 ml-3 bg-slate-200' : 'order-1 mr-3 bg-gradient-to-r from-blue-600 to-blue-700'
                                        }`}>
                                            {message.type === 'user' ? (
                                                <User className="w-4 h-4 text-slate-600" />
                                            ) : (
                                                <Wrench className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                                                <Wrench className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-1 relative">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Digite sua mensagem..."
                                            className="w-full p-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={isTyping}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl
                                            hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed 
                                            transition-all duration-200 transform hover:scale-105 active:scale-95"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Quick actions */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {[
                                        { icon: Search, text: 'Consultar OS', action: 'consultar_os' },
                                        { icon: Calendar, text: 'Agendar', action: 'agendar' },
                                        { icon: AlertCircle, text: 'Emergência', action: 'emergencia' }
                                    ].map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSendMessage(action.text, action.action)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-100 hover:bg-blue-100 
                                                text-slate-600 hover:text-blue-700 rounded-lg transition-colors"
                                        >
                                            <action.icon className="w-3 h-3" />
                                            {action.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(100px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes slideInMessage {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default OfixAssistantSimple;

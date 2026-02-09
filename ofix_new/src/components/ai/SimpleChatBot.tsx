// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, MessageCircle, Minimize2, Maximize2, X } from 'lucide-react';

const SimpleChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Sou o assistente virtual da OFIX. Como posso ajudá-lo hoje?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<any>(null);

  // Respostas automáticas baseadas em palavras-chave
  const getAutoResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('horário') || message.includes('funcionamento')) {
      return "🕐 Nosso horário de funcionamento é:\n• Segunda a Sexta: 8h às 18h\n• Sábado: 8h às 12h\n• Domingo: Fechado";
    }
    
    if (message.includes('agendamento') || message.includes('agendar')) {
      return "📅 Para agendar um serviço:\n• Ligue: (11) 99999-9999\n• WhatsApp: (11) 99999-9999\n• Ou venha pessoalmente à nossa oficina";
    }
    
    if (message.includes('endereço') || message.includes('localização') || message.includes('onde')) {
      return "📍 Nossa oficina fica localizada em:\nRua das Oficinas, 123 - Centro\nSão Paulo - SP\nCEP: 01234-567";
    }
    
    if (message.includes('preço') || message.includes('valor') || message.includes('quanto custa')) {
      return "💰 Os preços variam conforme o serviço:\n• Revisão básica: R$ 150-300\n• Troca de óleo: R$ 80-150\n• Diagnóstico: R$ 50\n\nPara orçamento específico, traga seu veículo para avaliação!";
    }
    
    if (message.includes('serviços') || message.includes('o que fazem')) {
      return "🔧 Nossos principais serviços:\n• Mecânica geral\n• Elétrica automotiva\n• Suspensão e freios\n• Ar condicionado\n• Diagnóstico computadorizado\n• Troca de óleo e filtros";
    }
    
    if (message.includes('problema') || message.includes('barulho') || message.includes('não liga')) {
      return "🚗 Para problemas no veículo:\n1. Descreva o sintoma detalhadamente\n2. Informe modelo e ano do carro\n3. Quando começou o problema\n\nRecomendo trazer para diagnóstico presencial!";
    }
    
    if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde')) {
      return "😊 Olá! Seja bem-vindo à OFIX! Estou aqui para ajudar com informações sobre nossos serviços. O que você gostaria de saber?";
    }
    
    if (message.includes('obrigado') || message.includes('valeu') || message.includes('tchau')) {
      return "😊 Por nada! Foi um prazer ajudar. Qualquer dúvida, estarei aqui. Tenha um ótimo dia!";
    }
    
    // Resposta padrão
    return "🤖 Entendi sua pergunta! Posso ajudar com:\n• Horários de funcionamento\n• Agendamentos\n• Localização da oficina\n• Serviços oferecidos\n• Preços e orçamentos\n\nSobre o que você gostaria de saber?";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular tempo de resposta
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getAutoResponse(inputValue),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 segundos
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50 animate-pulse"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Assistente OFIX</h3>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Online
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {['Horários', 'Serviços', 'Agendamento', 'Localização'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInputValue(suggestion);
                      handleSendMessage();
                    }}
                    className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    disabled={isTyping}
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-24"
                    rows="1"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 bottom-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleChatBot;

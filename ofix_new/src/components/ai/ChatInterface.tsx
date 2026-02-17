// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Bot, MessageCircle, Minimize2, Maximize2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickActions from './QuickActions';

export default function ChatInterface({ 
  isOpen, 
  onToggle, 
  userType = 'cliente',
  userId,
  className = '',
  onSendMessage,
  messages = [],
  isLoading = false,
  isConnected = true,
  conversationId,
  suggestions = []
}) {
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setShowSuggestions(false);

    // Chamar função de envio do componente pai
    if (onSendMessage) {
      await onSendMessage(messageText);
    }

    // Focar novamente no input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (typeof suggestion === 'string') {
      setInputValue(suggestion);
    } else {
      setInputValue(suggestion.text || suggestion.label || '');
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleQuickAction = async (action) => {
    if (onSendMessage) {
      await onSendMessage(`Ação: ${action.label || action.type}`);
    }
  };

  const handleMessageFeedback = async (messageId, feedback) => {
    console.log('Feedback enviado:', { messageId, feedback });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 z-fab min-w-[56px] min-h-[56px] flex items-center justify-center"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-dropdown ${className}`}>
      <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-xl backdrop-blur-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 ${
        isMinimized ? 'w-80 h-16' : 'w-[calc(100vw-3rem)] sm:w-96 h-[min(600px,calc(100dvh-6rem))]'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-900 bg-opacity-20 rounded-full p-2">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Assistente Pista</h3>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                {isConnected ? 'Online' : 'Reconectando...'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMinimize}
              className="p-1 hover:bg-white dark:bg-slate-900 hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label={isMinimized ? 'Maximizar' : 'Minimizar'}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white dark:bg-slate-900 hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Fechar chat"
            >
              ×
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" aria-live="polite" aria-relevant="additions">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <Bot className="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" />
                  <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Bem-vindo ao Assistente Pista</h3>
                  <p className="text-sm max-w-xs text-slate-500 dark:text-slate-400">
                    {userType === 'cliente' 
                      ? 'Estou aqui para ajudar com informações sobre seus serviços e agendamentos.'
                      : 'Pronto para auxiliar com diagnósticos técnicos e procedimentos.'
                    }
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onFeedback={(feedback) => handleMessageFeedback(message.id, feedback)}
                    onActionClick={handleQuickAction}
                  />
                ))
              )}
              
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActions
              userType={userType}
              onActionClick={handleQuickAction}
              className="px-4 py-2 border-t border-slate-100 dark:border-slate-800"
            />

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isConnected ? "Digite sua mensagem..." : "Reconnecting..."}
                    disabled={!isConnected || isLoading}
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 max-h-24 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    rows="1"
                    aria-label="Mensagem para o assistente"
                    style={{ height: 'auto' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                    }}
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !isConnected || isLoading}
                    className="absolute right-2 bottom-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    aria-label="Enviar mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {userType === 'cliente' ? 'Cliente' : 'Mecânico'} • {messages.length} mensagens
                </span>
                {isLoading && <span>Digitando...</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
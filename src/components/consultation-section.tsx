'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore, Message } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Trash2, 
  User, 
  Bot, 
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Sparkles,
  Heart
} from 'lucide-react';
import { nanoid } from 'nanoid';

const suggestionPrompts = [
  "Mi hijo tiene berrinches cuando le digo que no",
  "Mis hijos se pelean constantemente",
  "No sé cómo poner límites sin gritar",
  "Mi hijo no quiere hacer la tarea",
  "Cómo manejar el uso de pantallas"
];

export function ConsultationSection() {
  const { user, messages, addMessage, clearMessages, isLoading, setIsLoading } = useAppStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Preparar historial de conversación
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          situation: input.trim(),
          conversationHistory
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: data.response,
          category: data.category,
          timestamp: new Date()
        };

        addMessage(assistantMessage);

        if (data.riskWarning) {
          // Could show a special warning modal here
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage({
        id: nanoid(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const formatResponse = (content: string) => {
    // Split by the structure markers and format
    const sections = content.split(/\*\*(.*?)\*\*/g);
    
    return content.split('\n').map((line, index) => {
      // Format headers
      if (line.startsWith('**') && line.endsWith('**')) {
        const text = line.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="font-bold text-primary mt-4 mb-2 flex items-center gap-2">
            {text}
          </h3>
        );
      }
      // Format list items
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(2)}
          </li>
        );
      }
      // Format numbered items
      if (/^\d+\./.test(line)) {
        return (
          <li key={index} className="ml-4 mb-1 list-decimal">
            {line.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      // Regular text
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Consulta Inteligente
            </h2>
            <p className="text-sm text-muted-foreground">
              Describe tu situación y recibe orientación personalizada
            </p>
          </div>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearMessages}>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¿Cómo puedo ayudarte hoy?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Describe una situación específica con tu hijo/a. Mientras más detalles proporciones, 
              mejor será la orientación.
            </p>
            
            <div className="grid gap-2 w-full max-w-lg">
              <p className="text-sm text-muted-foreground mb-2">Sugerencias:</p>
              {suggestionPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-4"
                  onClick={() => handleSuggestion(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message rounded-2xl p-4 ${
                  message.role === 'user' ? 'user ml-12' : 'assistant mr-12'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${
                    message.role === 'user' ? 'bg-white/20' : 'bg-sage-100'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none">
                      {message.role === 'assistant' 
                        ? formatResponse(message.content)
                        : <p>{message.content}</p>
                      }
                    </div>
                    {message.category && (
                      <Badge variant="outline" className="mt-2">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message assistant rounded-2xl p-4 mr-12 flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-sage-100">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-muted-foreground">Pensando...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe la situación... (ej: 'Mi hijo de 5 años tiene berrinches cuando...')"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="btn-primary h-auto"
            size="lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}

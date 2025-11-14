import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getAIResponse } from '@/utils/chatAI';

interface Message {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  status: string;
}

interface ChatWidgetProps {
  showNotification?: boolean;
  onCloseNotification?: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ showNotification = false, onCloseNotification }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat();
    }
  }, [isOpen, isInitialized]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      // For authenticated users, create a conversation in the database
      if (session?.user?.id) {
        const userId = session.user.id;
        
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert([{
            user_id: userId,
            title: 'Support Chat',
            status: 'open'
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating conversation:', createError);
        } else if (newConversation) {
          setConversation(newConversation);
          
          // Subscribe to new messages for this conversation
          const channel = supabase
            .channel(`chat-messages-${newConversation.id}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'chat_messages',
                filter: `conversation_id=eq.${newConversation.id}`
              },
              (payload) => {
                console.log('New message received:', payload.new);
                setMessages(prev => [...prev, payload.new as Message]);
              }
            )
            .subscribe();

          setIsInitialized(true);
          return () => {
            supabase.removeChannel(channel);
          };
        }
      }
      
      // For non-authenticated users, just mark as initialized
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    // Hide welcome message when user starts typing
    setShowWelcome(false);

    // Initialize chat if not already done
    if (!isInitialized) {
      await initializeChat();
    }

    setIsLoading(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Add user message to UI immediately
      const userMessageId = crypto.randomUUID();
      const userMessage: Message = {
        id: userMessageId,
        message: messageText,
        sender_type: 'user',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Save to database if authenticated
      if (session?.user?.id && conversation) {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversation.id,
            user_id: session.user.id,
            sender_type: 'user',
            message: messageText
          }]);
      }

      // Prepare messages for AI
      const allMessages = messages.map(m => ({
        role: m.sender_type === 'user' ? 'user' : 'assistant',
        content: m.message
      }));
      
      // Add current user message
      allMessages.push({ role: 'user', content: messageText });

      // Call AI edge function with streaming
      const CHAT_URL = `https://vkllrotescxmqwogfamo.supabase.co/functions/v1/chat-support`;
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to get AI response');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let aiResponseText = "";

      // Create AI message placeholder
      const aiMessageId = crypto.randomUUID();
      
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              aiResponseText += content;
              // Update messages in real-time
              setMessages(prev => {
                const existing = prev.find(m => m.id === aiMessageId);
                if (existing) {
                  return prev.map(m => 
                    m.id === aiMessageId ? { ...m, message: aiResponseText } : m
                  );
                } else {
                  return [...prev, {
                    id: aiMessageId,
                    message: aiResponseText,
                    sender_type: 'admin' as const,
                    created_at: new Date().toISOString(),
                  }];
                }
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save AI response to database if authenticated
      if (aiResponseText && session?.user?.id && conversation) {
        await supabase
          .from('chat_messages')
          .insert({
            conversation_id: conversation.id,
            user_id: session.user.id,
            message: aiResponseText,
            sender_type: 'admin',
          });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleNotificationClick = () => {
    setIsOpen(true);
    onCloseNotification?.();
  };

  const handleQuickAction = (action: string) => {
    setShowWelcome(false);
    setNewMessage(action);
    // Auto-send the message
    setTimeout(() => sendMessage(), 100);
  };

  const handleChatOpen = () => {
    setIsOpen(true);
    // Reset state for fresh conversation
    setMessages([]);
    setConversation(null);
    setIsInitialized(false);
    setShowWelcome(true);
  };

  const handleChatClose = () => {
    setIsOpen(false);
    // Clean up state
    setMessages([]);
    setConversation(null);
    setIsInitialized(false);
    setShowWelcome(true);
  };

  return (
    <>
      {/* Notification Popup */}
      {showNotification && !isOpen && (
        <div className="fixed bottom-20 right-2 sm:right-4 z-50 animate-fade-in max-w-[calc(100vw-1rem)] sm:max-w-xs">
          <div className="bg-white rounded-lg shadow-lg border p-4 relative">
            <button
              onClick={onCloseNotification}
              className="absolute -top-2 -left-2 bg-muted rounded-full p-1.5 hover:bg-muted/80 touch-target"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleNotificationClick}
              className="text-left w-full hover:bg-muted/50 rounded p-2 transition-colors touch-target"
            >
              <p className="text-sm font-medium text-foreground">
                Welcome to Dividify! How can I help you?
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
        {!isOpen ? (
          <div className="relative">
            <Button
              onClick={handleChatOpen}
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-[#9b87f5] hover:bg-[#8b77e5] shadow-lg animate-scale-in touch-target"
              size="icon"
            >
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
            </Button>
            {messages.filter(m => m.sender_type === 'admin').length > 0 && (
              <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                1
              </div>
            )}
          </div>
        ) : (
          <Card className="w-[calc(100vw-1rem)] sm:w-80 h-[calc(100vh-5rem)] sm:h-96 flex flex-col shadow-xl animate-scale-in">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-[#9b87f5] text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">Dividify AI</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleChatClose}
                className="text-white hover:bg-white/20 touch-target h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/10">
              {showWelcome && messages.length === 0 && !isLoading ? (
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-lg px-3 py-2 text-sm bg-background border">
                      <p className="text-foreground mb-3">Hello! 👋 I'm here to help you with Dividify!</p>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground mb-2">I can assist with:</p>
                        <div className="space-y-2">
                          <button 
                            onClick={() => handleQuickAction('How do I get started?')}
                            className="block w-full text-left text-sm text-primary hover:text-primary/80 hover:bg-muted/50 p-2 rounded transition-colors"
                          >
                            • 🚀 Getting started
                          </button>
                          <button 
                            onClick={() => handleQuickAction('What are your pricing plans?')}
                            className="block w-full text-left text-sm text-primary hover:text-primary/80 hover:bg-muted/50 p-2 rounded transition-colors"
                          >
                            • 💰 Pricing questions
                          </button>
                          <button 
                            onClick={() => handleQuickAction('How do I create dividend vouchers?')}
                            className="block w-full text-left text-sm text-primary hover:text-primary/80 hover:bg-muted/50 p-2 rounded transition-colors"
                          >
                            • 📄 Document creation
                          </button>
                          <button 
                            onClick={() => handleQuickAction('Are your documents HMRC compliant?')}
                            className="block w-full text-left text-sm text-primary hover:text-primary/80 hover:bg-muted/50 p-2 rounded transition-colors"
                          >
                            • ⚖️ HMRC compliance
                          </button>
                          <button 
                            onClick={() => handleQuickAction('I need technical support')}
                            className="block w-full text-left text-sm text-primary hover:text-primary/80 hover:bg-muted/50 p-2 rounded transition-colors"
                          >
                            • 🔧 Technical support
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.sender_type === 'user'
                          ? 'bg-[#9b87f5] text-white'
                          : 'bg-background border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-background border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 sm:p-4 border-t bg-background">
              <div className="flex gap-2 items-center">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a reply..."
                  disabled={isLoading}
                  className="flex-1 text-sm sm:text-base h-9 sm:h-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground touch-target h-9 w-9 sm:h-10 sm:w-10 p-0"
                  onClick={() => {
                    // Basic emoji picker functionality
                    const emojis = ['😊', '👍', '❤️', '😄', '🎉', '✅'];
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    setNewMessage(prev => prev + randomEmoji);
                  }}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  size="sm"
                  className="bg-[#9b87f5] hover:bg-[#8b77e5] touch-target h-9 sm:h-10 px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Privacy Policy
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
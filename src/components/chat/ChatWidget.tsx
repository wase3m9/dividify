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
      
      // Check for existing conversation
      const userId = session?.user?.id || null;
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .eq('status', 'open')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (userId === null) {
        query = query.is('user_id', null);
      } else {
        query = query.eq('user_id', userId);
      }
      
      const { data: existingConversations, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        throw fetchError;
      }

      let conversationId;
      
      if (existingConversations && existingConversations.length > 0) {
        conversationId = existingConversations[0].id;
        setConversation(existingConversations[0]);
      } else {
        // Create new conversation
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
          throw createError;
        }
        
        if (newConversation) {
          conversationId = newConversation.id;
          setConversation(newConversation);
        }
      }

      // Load messages
      if (conversationId) {
        const { data: chatMessages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          throw messagesError;
        }

        if (chatMessages) {
          setMessages(chatMessages as Message[]);
        }

        // Subscribe to new messages
        const channel = supabase
          .channel('chat-messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `conversation_id=eq.${conversationId}`
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
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize chat. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || isLoading) return;

    setIsLoading(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversation.id,
          user_id: session?.user?.id || null,
          sender_type: 'user',
          message: messageText
        }]);

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      // Send AI auto-response
      setTimeout(async () => {
        const aiResponse = getAIResponse(messageText);
        const responseMessage = aiResponse || 
          "Thank you for your message! Our support team will get back to you within 24-48 hours. For urgent matters, please email us directly at info@cloud-keepers.co.uk.";

        const { error: responseError } = await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversation.id,
            user_id: null,
            sender_type: 'admin',
            message: responseMessage
          }]);

        if (responseError) {
          console.error('Error sending auto-response:', responseError);
        }
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
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

  return (
    <>
      {/* Notification Popup */}
      {showNotification && !isOpen && (
        <div className="fixed bottom-20 right-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg border p-4 max-w-xs relative">
            <button
              onClick={onCloseNotification}
              className="absolute -top-2 -left-2 bg-muted rounded-full p-1 hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleNotificationClick}
              className="text-left w-full hover:bg-muted/50 rounded p-2 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">
                Welcome to Dividify! How can I help you?
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen ? (
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 bg-[#9b87f5] hover:bg-[#8b77e5] shadow-lg animate-scale-in"
              size="icon"
            >
              <MessageCircle className="h-7 w-7" />
            </Button>
            {messages.filter(m => m.sender_type === 'admin').length > 0 && (
              <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                1
              </div>
            )}
          </div>
        ) : (
          <Card className="w-80 h-96 flex flex-col shadow-xl animate-scale-in">
            <div className="flex items-center justify-between p-4 bg-[#9b87f5] text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">Dividify AI</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
              {messages.length === 0 && !isLoading ? (
                <div className="space-y-2">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-background border">
                      <p className="text-foreground">Welcome to Dividify! How can I help you?</p>
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
                      <div dangerouslySetInnerHTML={{ 
                        __html: message.message.replace(/\n/g, '<br/>') 
                      }} />
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
            
            <div className="p-4 border-t bg-background">
              <div className="flex gap-2 items-center">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write a reply..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
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
                  className="bg-[#9b87f5] hover:bg-[#8b77e5]"
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
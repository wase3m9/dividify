import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !conversation) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check for existing conversation
      const { data: existingConversations } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', session?.user?.id || null)
        .eq('status', 'open')
        .order('updated_at', { ascending: false })
        .limit(1);

      let conversationId;
      
      if (existingConversations && existingConversations.length > 0) {
        conversationId = existingConversations[0].id;
        setConversation(existingConversations[0]);
      } else {
        // Create new conversation
        const { data: newConversation } = await supabase
          .from('chat_conversations')
          .insert([{
            user_id: session?.user?.id || null,
            title: 'Support Chat',
            status: 'open'
          }])
          .select()
          .single();
        
        if (newConversation) {
          conversationId = newConversation.id;
          setConversation(newConversation);
        }
      }

      // Load messages
      if (conversationId) {
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

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
              setMessages(prev => [...prev, payload.new as Message]);
            }
          )
          .subscribe();

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
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversation || isLoading) return;

    setIsLoading(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversation.id,
          user_id: session?.user?.id || null,
          sender_type: 'user',
          message: messageText
        }]);

      // Send automatic response for demo
      setTimeout(async () => {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: conversation.id,
            user_id: null,
            sender_type: 'admin',
            message: "Thank you for your message! Our support team will get back to you shortly during business hours (Monday-Friday, 9 AM - 5 PM GMT)."
          }]);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="font-semibold">Support Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm">
                <p>Welcome to Dividify Support!</p>
                <p>How can we help you today?</p>
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
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
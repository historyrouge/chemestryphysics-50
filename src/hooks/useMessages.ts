import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    username: string;
    name: string;
    avatar_url: string;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: {
    user_id: string;
    profiles: {
      username: string;
      name: string;
      avatar_url: string;
    };
  }[];
  lastMessage?: Message;
}

export const useMessages = (userId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants!inner (
            user_id,
            profiles (
              username,
              name,
              avatar_url
            )
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get last message for each conversation
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            lastMessage
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!userId || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return false;
    }
  };

  const createConversation = async (otherUserId: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        user1_id: userId,
        user2_id: otherUserId
      });

      if (error) throw error;

      await fetchConversations();
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          const newMessage = payload.new as Message;
          
          if (selectedConversation === newMessage.conversation_id) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Refresh conversations to update last message
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, selectedConversation]);

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  return {
    conversations,
    messages,
    loading,
    selectedConversation,
    setSelectedConversation,
    sendMessage,
    createConversation,
    refetch: fetchConversations
  };
};
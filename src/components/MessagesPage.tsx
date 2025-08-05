import { ArrowLeft, Search, MoreHorizontal, Send, UserPlus, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useMessages } from '@/hooks/useMessages';
import { useFollows } from '@/hooks/useFollows';
import { formatDistanceToNow } from 'date-fns';
import UserSearch from '@/components/UserSearch';
import StarField from './StarField';

interface MessagesPageProps {
  onNavigateBack: () => void;
}

const MessagesPage = ({ onNavigateBack }: MessagesPageProps) => {
  const { user } = useSupabaseAuth();
  const { 
    conversations, 
    messages, 
    loading, 
    selectedConversation, 
    setSelectedConversation, 
    sendMessage 
  } = useMessages(user?.id);
  const { follows } = useFollows(user?.id);
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter(conv => {
    const otherUser = conv.participants?.find(p => p.user_id !== user?.id);
    const displayName = otherUser?.profiles?.name || otherUser?.profiles?.username || 'Unknown';
    return displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const success = await sendMessage(selectedConversation, newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartChat = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setActiveTab('chats');
  };

  const getOtherUser = (conversation: any) => {
    return conversation.participants?.find((p: any) => p.user_id !== user?.id);
  };

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <StarField />
        <div className="relative z-10 flex items-center justify-center h-full">
          <p className="text-muted-foreground">Please sign in to access messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 glass-effect border-b border-border z-20">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={selectedConversation ? () => setSelectedConversation(null) : onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              {selectedConversation ? (
                <div className="flex items-center gap-3">
                  {(() => {
                    const conversation = conversations.find(c => c.id === selectedConversation);
                    const otherUser = conversation ? getOtherUser(conversation) : null;
                    const displayName = otherUser?.profiles?.name || otherUser?.profiles?.username || 'Unknown User';
                    const avatar = otherUser?.profiles?.avatar_url;
                    
                    return (
                      <>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-gradient-cosmic text-white">
                            {displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="font-semibold">{displayName}</h1>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <h1 className="text-xl font-bold">Messages</h1>
              )}
            </div>
            {selectedConversation && (
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-border`}>
            <div className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="chats">Chats</TabsTrigger>
                  <TabsTrigger value="people">
                    <UserPlus className="w-4 h-4 mr-1" />
                    People
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chats" className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-input/50 border-border"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      </div>
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                        <p className="text-muted-foreground text-sm">
                          Follow users from the People tab to start chatting!
                        </p>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => {
                        const otherUser = getOtherUser(conversation);
                        const displayName = otherUser?.profiles?.name || otherUser?.profiles?.username || 'Unknown User';
                        const avatar = otherUser?.profiles?.avatar_url;
                        
                        return (
                          <div
                            key={conversation.id}
                            onClick={() => setSelectedConversation(conversation.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedConversation === conversation.id 
                                ? 'bg-accent/20' 
                                : 'hover:bg-accent/10'
                            }`}
                          >
                            <div className="flex gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={avatar} />
                                <AvatarFallback className="bg-gradient-cosmic text-white">
                                  {displayName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold truncate">{displayName}</h3>
                                  {conversation.lastMessage && (
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(conversation.lastMessage.created_at)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage?.content || 'No messages yet'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="people" className="space-y-4">
                  <UserSearch onStartChat={handleStartChat} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.sender_id === user?.id 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(message.created_at)}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-input/50 border-border"
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={handleSendMessage} size="icon" disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
import { ArrowLeft, Search, MoreHorizontal, Send, UserPlus, MessageCircle, Smile } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow new line with Shift+Enter
        return;
      } else {
        // Send message with Enter
        e.preventDefault();
        handleSendMessage();
      }
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
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                              selectedConversation === conversation.id 
                                ? 'bg-accent/20 border-accent/40' 
                                : 'hover:bg-accent/10 border-transparent hover:border-accent/20'
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12 ring-2 ring-accent/20">
                                  <AvatarImage src={avatar} />
                                  <AvatarFallback className="bg-gradient-cosmic text-white">
                                    {displayName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold truncate text-accent">{displayName}</h3>
                                  {conversation.lastMessage && (
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(conversation.lastMessage.created_at)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate leading-relaxed">
                                  {conversation.lastMessage?.content || 'Say hello! 👋'}
                                </p>
                                {!conversation.lastMessage?.is_read && conversation.lastMessage?.sender_id !== user?.id && (
                                  <div className="w-2 h-2 bg-accent rounded-full mt-1"></div>
                                )}
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
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-2">
                        <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">No messages yet</p>
                        <p className="text-sm text-muted-foreground">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-200 ${
                          message.sender_id === user?.id 
                            ? 'bg-gradient-cosmic text-white shadow-lg' 
                            : 'bg-muted/80 hover:bg-muted border border-accent/10'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <div className={`flex items-center justify-between mt-2 ${
                            message.sender_id === user?.id ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            <p className="text-xs">{formatTime(message.created_at)}</p>
                            {message.sender_id === user?.id && (
                              <span className="text-xs">
                                {message.is_read ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border bg-background/50">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="min-h-[40px] max-h-32 bg-input/80 border-accent/20 focus:border-accent resize-none"
                        onKeyDown={handleKeyPress}
                        rows={1}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent p-1.5"
                          >
                            <Smile className="w-4 h-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {newMessage.length}/1000
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      variant="cosmic"
                      size="icon"
                      className="mb-1"
                    >
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
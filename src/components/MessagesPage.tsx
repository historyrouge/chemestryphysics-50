import { ArrowLeft, Search, MoreHorizontal, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarField from './StarField';

interface MessagesPageProps {
  onNavigateBack: () => void;
}

const MessagesPage = ({ onNavigateBack }: MessagesPageProps) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      user: { name: 'Dr. Stella Vega', username: 'stellavega', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86d85ba?w=40&h=40&fit=crop' },
      lastMessage: 'Just captured Saturn\'s rings with my new telescope! 🪐',
      time: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      user: { name: 'Commander Orion', username: 'cmd_orion', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
      lastMessage: 'The Mars mission data is fascinating',
      time: '15m ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      user: { name: 'Luna Artemis', username: 'luna_artemis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop' },
      lastMessage: 'Meteor shower tonight at 11 PM! 🌠',
      time: '1h ago',
      unread: 1,
      online: true
    },
    {
      id: 4,
      user: { name: 'Phoenix Cosmos', username: 'phoenix_cosmos', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop' },
      lastMessage: 'Your bit about black holes was mind-blowing',
      time: '2h ago',
      unread: 0,
      online: false
    },
    {
      id: 5,
      user: { name: 'Astro Isabella', username: 'astro_bella', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop' },
      lastMessage: 'Can you share that star chart you made?',
      time: '3h ago',
      unread: 3,
      online: true
    },
    {
      id: 6,
      user: { name: 'Captain Nova', username: 'captain_nova', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop' },
      lastMessage: 'ISS pass was perfect tonight ✨',
      time: '5h ago',
      unread: 0,
      online: false
    },
    {
      id: 7,
      user: { name: 'Galaxy Zoe', username: 'galaxy_zoe', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop' },
      lastMessage: 'Love your astrophotography tips!',
      time: '1d ago',
      unread: 0,
      online: true
    }
  ];

  const getMessagesForChat = (chatId: number) => {
    const messageGroups: { [key: number]: any[] } = {
      1: [
        { id: 1, text: 'Hey! Just saw your latest bit about Saturn\'s rings 🪐', sender: 'other', time: '12m ago' },
        { id: 2, text: 'Thanks! Took me 4 hours to get that perfect alignment', sender: 'me', time: '10m ago' },
        { id: 3, text: 'The detail on Cassini Division is incredible', sender: 'other', time: '8m ago' },
        { id: 4, text: 'Just captured Saturn\'s rings with my new telescope! 🪐', sender: 'other', time: '2m ago' },
      ],
      2: [
        { id: 1, text: 'The Mars mission data is fascinating', sender: 'other', time: '15m ago' },
        { id: 2, text: 'Have you seen the latest rover images?', sender: 'me', time: '12m ago' },
        { id: 3, text: 'The geology samples are groundbreaking', sender: 'other', time: '8m ago' },
      ],
      3: [
        { id: 1, text: 'Meteor shower tonight at 11 PM! 🌠', sender: 'other', time: '1h ago' },
        { id: 2, text: 'Which constellation should I look towards?', sender: 'me', time: '58m ago' },
        { id: 3, text: 'Perseus! Best viewing around midnight', sender: 'other', time: '55m ago' },
      ]
    };
    return messageGroups[chatId] || [];
  };

  const messages = selectedChat ? getMessagesForChat(selectedChat) : [];

  const sendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('');
      // In a real app, send message logic would go here
    }
  };

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
              onClick={selectedChat ? () => setSelectedChat(null) : onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              {selectedChat ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={conversations.find(c => c.id === selectedChat)?.user.avatar} />
                    <AvatarFallback>{conversations.find(c => c.id === selectedChat)?.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-semibold">{conversations.find(c => c.id === selectedChat)?.user.name}</h1>
                    <p className="text-xs text-muted-foreground">
                      {conversations.find(c => c.id === selectedChat)?.online ? 'Online' : 'Last seen 3h ago'}
                    </p>
                  </div>
                </div>
              ) : (
                <h1 className="text-xl font-bold">Messages</h1>
              )}
            </div>
            {selectedChat && (
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex h-[calc(100vh-80px)]">
          {/* Conversations List */}
          <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-border`}>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 bg-input/50 border-border"
                />
              </div>
              
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat === conversation.id 
                        ? 'bg-accent/20' 
                        : 'hover:bg-accent/10'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
            {selectedChat ? (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.sender === 'me' 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose from your existing conversations or start a new one</p>
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
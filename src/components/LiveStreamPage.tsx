import { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Settings,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Send,
  Eye,
  Star,
  Gift,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveStreamPageProps {
  onNavigate?: (page: string) => void;
}

interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamer: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    followers: number;
  };
  viewers: number;
  likes: number;
  duration: string;
  category: string;
  thumbnail: string;
  isLive: boolean;
}

interface ChatMessage {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  type: 'message' | 'like' | 'follow' | 'gift';
}

const LiveStreamPage = ({ onNavigate }: LiveStreamPageProps) => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamControls, setStreamControls] = useState({
    microphone: true,
    camera: true,
    chat: true
  });

  const liveStreams: LiveStream[] = [
    {
      id: '1',
      title: 'Exploring the Ring Nebula - Live Telescope Session',
      description: 'Join me for a live deep-sky observation session targeting the famous Ring Nebula in Lyra!',
      streamer: {
        name: 'Dr. Cosmos',
        username: 'drcosmoslive',
        avatar: '/placeholder.svg',
        verified: true,
        followers: 45600
      },
      viewers: 1247,
      likes: 892,
      duration: '1:23:45',
      category: 'Astronomy',
      thumbnail: '/placeholder.svg',
      isLive: true
    },
    {
      id: '2',
      title: 'Aurora Hunting in Iceland - LIVE',
      description: 'Real-time aurora borealis chase from the Icelandic highlands. Will we see the northern lights tonight?',
      streamer: {
        name: 'Aurora Chaser',
        username: 'aurorachaser',
        avatar: '/placeholder.svg',
        followers: 23400
      },
      viewers: 2156,
      likes: 1456,
      duration: '2:45:12',
      category: 'Nature',
      thumbnail: '/placeholder.svg',
      isLive: true
    },
    {
      id: '3',
      title: 'Building a Dobsonian Telescope - Workshop',
      description: 'Follow along as I build a 10-inch Dobsonian telescope from scratch. Learn tips and tricks!',
      streamer: {
        name: 'Scope Builder',
        username: 'scopebuilder',
        avatar: '/placeholder.svg',
        verified: true,
        followers: 18900
      },
      viewers: 567,
      likes: 234,
      duration: '3:12:08',
      category: 'DIY',
      thumbnail: '/placeholder.svg',
      isLive: true
    }
  ];

  useEffect(() => {
    // Simulate live chat messages
    if (selectedStream) {
      const interval = setInterval(() => {
        const mockMessages: ChatMessage[] = [
          {
            id: Date.now().toString(),
            user: {
              name: 'StarGazer99',
              username: 'stargazer99',
              avatar: '/placeholder.svg'
            },
            message: 'Amazing view of the nebula! Can you zoom in more?',
            timestamp: 'now',
            type: 'message'
          },
          {
            id: (Date.now() + 1).toString(),
            user: {
              name: 'CosmicExplorer',
              username: 'cosmicexplorer',
              avatar: '/placeholder.svg'
            },
            message: '❤️ Loved this stream!',
            timestamp: 'now',
            type: 'like'
          }
        ];

        setChatMessages(prev => [...prev, mockMessages[Math.floor(Math.random() * mockMessages.length)]]);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedStream) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          username: 'currentuser',
          avatar: '/placeholder.svg'
        },
        message: newMessage,
        timestamp: 'now',
        type: 'message'
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleStreamControl = (control: keyof typeof streamControls) => {
    setStreamControls(prev => ({
      ...prev,
      [control]: !prev[control]
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Video className="h-8 w-8 text-red-500" />
              Live Streams
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Watch and broadcast live cosmic experiences
            </p>
          </div>
          <Button 
            onClick={() => setIsStreaming(!isStreaming)}
            className={isStreaming ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            <Video className="h-4 w-4 mr-2" />
            {isStreaming ? 'End Stream' : 'Go Live'}
          </Button>
        </div>

        {selectedStream ? (
          /* Stream Viewer */
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Stream */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="glass-effect">
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src={selectedStream.thumbnail}
                      alt="Stream"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge variant="destructive" className="animate-pulse">
                        LIVE
                      </Badge>
                      <Badge variant="secondary">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatNumber(selectedStream.viewers)}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-black/50">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-black/50">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stream Info */}
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedStream.streamer.avatar} />
                      <AvatarFallback>{selectedStream.streamer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">{selectedStream.title}</h2>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold">{selectedStream.streamer.name}</span>
                        {selectedStream.streamer.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {selectedStream.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{selectedStream.description}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {formatNumber(selectedStream.streamer.followers)} followers
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {formatNumber(selectedStream.likes)} likes
                        </span>
                        <span>Duration: {selectedStream.duration}</span>
                      </div>
                    </div>
                    <Button>Follow</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Chat */}
            <div className="space-y-4">
              <Card className="glass-effect h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Live Chat
                    <Badge variant="secondary" className="ml-auto">
                      {formatNumber(selectedStream.viewers)} viewers
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-4 pt-0">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.user.avatar} />
                            <AvatarFallback className="text-xs">{message.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-primary">
                                {message.user.name}
                              </span>
                              {message.type === 'like' && (
                                <Heart className="h-3 w-3 text-red-500" />
                              )}
                              {message.type === 'follow' && (
                                <Star className="h-3 w-3 text-yellow-500" />
                              )}
                              {message.type === 'gift' && (
                                <Gift className="h-3 w-3 text-purple-500" />
                              )}
                            </div>
                            <p className="text-sm text-foreground break-words">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1 mt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Heart className="h-3 w-3 mr-1" />
                      Like
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Gift className="h-3 w-3 mr-1" />
                      Gift
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stream Controls (if streaming) */}
              {isStreaming && (
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Stream Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={streamControls.microphone ? "default" : "outline"}
                        onClick={() => toggleStreamControl('microphone')}
                        className="flex items-center gap-2"
                      >
                        {streamControls.microphone ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                        Mic
                      </Button>
                      <Button 
                        variant={streamControls.camera ? "default" : "outline"}
                        onClick={() => toggleStreamControl('camera')}
                        className="flex items-center gap-2"
                      >
                        {streamControls.camera ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                        Camera
                      </Button>
                    </div>
                    <Button variant="destructive" className="w-full" onClick={() => setIsStreaming(false)}>
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Stream
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Stream Grid */
          <div className="space-y-6">
            {/* Featured Stream */}
            <Card className="glass-effect">
              <CardContent className="p-0">
                <div className="relative aspect-[21/9] bg-black rounded-lg overflow-hidden">
                  <img 
                    src={liveStreams[0].thumbnail}
                    alt="Featured Stream"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="destructive" className="animate-pulse">
                      LIVE
                    </Badge>
                    <Badge variant="secondary">Featured</Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{liveStreams[0].title}</h2>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {formatNumber(liveStreams[0].viewers)} viewers
                          </span>
                          <span>{liveStreams[0].streamer.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {liveStreams[0].category}
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedStream(liveStreams[0])}>
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Streams Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.slice(1).map((stream) => (
                <Card key={stream.id} className="glass-effect hover-lift cursor-pointer" onClick={() => setSelectedStream(stream)}>
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
                      <img 
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="destructive" className="animate-pulse text-xs">
                          LIVE
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          {formatNumber(stream.viewers)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="outline" className="text-xs">
                          {stream.duration}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{stream.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stream.streamer.avatar} />
                          <AvatarFallback>{stream.streamer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{stream.streamer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNumber(stream.streamer.followers)} followers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {stream.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {formatNumber(stream.likes)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        {selectedStream && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setSelectedStream(null)}>
              Back to Streams
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;
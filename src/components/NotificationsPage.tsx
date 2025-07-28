import { ArrowLeft, Heart, MessageCircle, Repeat, UserPlus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarField from './StarField';

interface NotificationsPageProps {
  onNavigateBack: () => void;
}

const NotificationsPage = ({ onNavigateBack }: NotificationsPageProps) => {
  const notifications = [
    {
      id: 1,
      type: 'like',
      user: { name: 'Alex Cosmic', username: 'alexc', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop' },
      content: 'liked your post about stellar formations',
      time: '2m ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 2,
      type: 'repost',
      user: { name: 'Luna Star', username: 'lunastar', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86d85ba?w=40&h=40&fit=crop' },
      content: 'reposted your cosmic journey story',
      time: '5m ago',
      icon: Repeat,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'follow',
      user: { name: 'Nebula Explorer', username: 'nebula_ex', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop' },
      content: 'started following you',
      time: '1h ago',
      icon: UserPlus,
      color: 'text-blue-500'
    },
    {
      id: 4,
      type: 'comment',
      user: { name: 'Galaxy Guide', username: 'galaxyguide', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
      content: 'commented on your bit about black holes',
      time: '2h ago',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      id: 5,
      type: 'mention',
      user: { name: 'Space Photographer', username: 'spacephoto', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop' },
      content: 'mentioned you in a post about astrophotography',
      time: '3h ago',
      icon: Star,
      color: 'text-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 glass-effect border-b border-border z-20">
          <div className="flex items-center gap-4 p-4 max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Notifications</h1>
              <p className="text-sm text-muted-foreground">{notifications.length} new</p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <Card key={notification.id} className="glass-effect border-border hover:bg-card/90 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center ${notification.color}`}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.user.name}</span>
                        <span className="text-muted-foreground"> {notification.content}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <Card className="glass-effect border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">You're all caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new notifications</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
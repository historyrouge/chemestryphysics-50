import { useState } from 'react';
import { Bell, Heart, MessageCircle, Share, UserPlus, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'follow' | 'mention';
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
  postId?: string;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      user: {
        name: 'Luna Stardust',
        avatar: '/placeholder.svg',
        username: 'lunastardust',
      },
      content: 'liked your post about constellation discoveries',
      timestamp: '2m ago',
      isRead: false,
      postId: '1',
    },
    {
      id: '2',
      type: 'comment',
      user: {
        name: 'Cosmic Explorer',
        avatar: '/placeholder.svg',
        username: 'cosmicexplorer',
      },
      content: 'commented: "This is absolutely amazing! Which telescope did you use?"',
      timestamp: '5m ago',
      isRead: false,
      postId: '1',
    },
    {
      id: '3',
      type: 'follow',
      user: {
        name: 'Nebula Dreams',
        avatar: '/placeholder.svg',
        username: 'nebuladreams',
      },
      content: 'started following you',
      timestamp: '1h ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'share',
      user: {
        name: 'Galaxy Hunter',
        avatar: '/placeholder.svg',
        username: 'galaxyhunter',
      },
      content: 'shared your bit "Saturn\'s Ring Dance"',
      timestamp: '2h ago',
      isRead: true,
      postId: '1',
    },
    {
      id: '5',
      type: 'mention',
      user: {
        name: 'Star Whisperer',
        avatar: '/placeholder.svg',
        username: 'starwhisperer',
      },
      content: 'mentioned you in a post about space photography',
      timestamp: '3h ago',
      isRead: true,
      postId: '2',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-cosmic-accent" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-400" />;
      case 'share':
        return <Share className="h-4 w-4 text-green-400" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-purple-400" />;
      case 'mention':
        return <Star className="h-4 w-4 text-yellow-400" />;
      default:
        return <Bell className="h-4 w-4 text-cosmic-muted" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cosmic-card max-w-md h-[600px] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-cosmic-border">
          <DialogTitle className="text-cosmic-text flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-cosmic-accent text-white">
                {unreadCount}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-6 pt-0 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-cosmic-muted mx-auto mb-4" />
                <p className="text-cosmic-muted">No notifications yet</p>
                <p className="text-sm text-cosmic-muted mt-2">
                  When someone interacts with your content, you'll see it here
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg hover:bg-cosmic-secondary/30 cursor-pointer group transition-all ${
                    !notification.isRead ? 'bg-cosmic-secondary/20 border-l-2 border-cosmic-accent' : ''
                  }`}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-cosmic-accent/20">
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback className="bg-cosmic-gradient text-white text-sm">
                      {notification.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium text-cosmic-text text-sm">
                        {notification.user.name}
                      </span>
                      <span className="text-xs text-cosmic-muted">
                        {notification.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-sm text-cosmic-text leading-relaxed">
                      {notification.content}
                    </p>
                    
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-cosmic-accent rounded-full mt-2" />
                    )}
                  </div>
                  
                  {notification.postId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-cosmic-border">
          <Button
            variant="outline"
            className="w-full cosmic-button"
            onClick={() => {
              // Mark all as read functionality
            }}
          >
            Mark All as Read
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
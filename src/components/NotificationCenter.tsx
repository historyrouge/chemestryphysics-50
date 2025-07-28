import { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Share, TrendingUp, Star, X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'mention' | 'trending';
  title: string;
  message: string;
  avatar?: string;
  username?: string;
  timestamp: Date;
  read: boolean;
  postId?: string;
  url?: string;
}

const NotificationCenter = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      title: 'New like on your post',
      message: 'Sarah liked your post about cosmic photography',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      username: 'sarah_cosmos',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      type: 'comment',
      title: 'New comment',
      message: 'Alex commented: "Amazing shot of the nebula!"',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      username: 'alex_stargazer',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      type: 'follow',
      title: 'New follower',
      message: 'Maya started following you',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      username: 'maya_universe',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      type: 'trending',
      title: 'Your post is trending!',
      message: 'Your post about "Mars exploration" is gaining popularity',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
    },
    {
      id: '5',
      type: 'share',
      title: 'Post shared',
      message: 'Jake shared your cosmic timelapse video',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
      username: 'jake_cosmos',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" fill="currentColor" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'share':
        return <Share className="w-4 h-4 text-purple-500" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-accent" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-accent/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-y-auto bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-glow-primary z-50">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-border/20 last:border-b-0 cursor-pointer hover:bg-accent/5 transition-colors ${
                    !notification.read ? 'bg-accent/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.avatar} alt={notification.username} />
                          <AvatarFallback className="bg-accent/20">
                            {notification.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getNotificationIcon(notification.type)}
                        <span className="text-sm font-medium">{notification.title}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-border/50">
              <Button variant="ghost" className="w-full text-sm">
                View all notifications
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
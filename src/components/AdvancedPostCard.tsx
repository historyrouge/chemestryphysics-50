import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, TrendingUp, Eye, Users } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface PostWithProfile {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes: number;
  comments: number;
  profiles?: {
    id: string;
    name: string;
    username: string;
    avatar_url?: string;
  };
  is_liked?: boolean;
  is_bookmarked?: boolean;
  views?: number;
  shares?: number;
  is_trending?: boolean;
  engagement_rate?: number;
}

interface AdvancedPostCardProps {
  post: PostWithProfile;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  showAnalytics?: boolean;
}

const AdvancedPostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onBookmark, 
  showAnalytics = false 
}: AdvancedPostCardProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.profiles?.name}`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Post link copied to clipboard',
        });
      }
      onShare(post.id);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleReaction = (reaction: string) => {
    toast({
      title: 'Reaction added!',
      description: `You reacted with ${reaction}`,
    });
    setShowReactions(false);
    // In a real app, this would send the reaction to the backend
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 10) return 'text-green-500';
    if (rate >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="bg-card/80 backdrop-blur-md border-border/50 hover:border-accent/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-accent/20">
            <AvatarImage src={post.profiles?.avatar_url || ''} alt={post.profiles?.name} />
            <AvatarFallback className="bg-accent/20">
              {post.profiles?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold hover:text-accent cursor-pointer">
                  {post.profiles?.name}
                </span>
                <span className="text-muted-foreground">@{post.profiles?.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {post.is_trending && (
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Bookmark className="w-4 h-4 mr-2" />
                    {post.is_bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="w-4 h-4 mr-2" />
                    Follow @{post.profiles?.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400">
                    Report post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <p className="text-foreground mb-4 leading-relaxed">
              {post.content.split(' ').map((word, index) => {
                if (word.startsWith('#')) {
                  return (
                    <span key={index} className="text-accent hover:underline cursor-pointer">
                      {word}{' '}
                    </span>
                  );
                }
                if (word.startsWith('@')) {
                  return (
                    <span key={index} className="text-blue-400 hover:underline cursor-pointer">
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </p>
            
            {post.image_url && (
              <div className="mb-4 rounded-lg overflow-hidden border border-border/30">
                <img 
                  src={post.image_url} 
                  alt="Post image"
                  className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            {showAnalytics && (
              <div className="flex gap-4 text-xs text-muted-foreground mb-3 p-2 bg-accent/5 rounded-lg">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(post.views || 0)} views
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className={getEngagementColor(post.engagement_rate || 0)}>
                    {post.engagement_rate?.toFixed(1)}% engagement
                  </span>
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2 border-t border-border/20">
              <div className="flex gap-6">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReactions(!showReactions)}
                    className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
                      post.is_liked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                    <span>{formatNumber(post.likes || 0)}</span>
                  </Button>
                  
                  {showReactions && (
                    <div className="absolute bottom-full left-0 mb-2 p-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg flex gap-1 z-10">
                      {reactions.map((reaction, index) => (
                        <button
                          key={index}
                          onClick={() => handleReaction(reaction)}
                          className="text-lg hover:scale-125 transition-transform duration-200 p-1 rounded hover:bg-accent/20"
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment(post.id)}
                  className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatNumber(post.comments || 0)}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center gap-2 hover:text-green-500 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>{formatNumber(post.shares || 0)}</span>
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onBookmark?.(post.id)}
                className={`hover:text-yellow-500 transition-colors ${
                  post.is_bookmarked ? 'text-yellow-500' : ''
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.is_bookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedPostCard;
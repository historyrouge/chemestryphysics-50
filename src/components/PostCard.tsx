import { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal, Bookmark, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    image_url: string | null;
    user_id: string;
    profiles: {
      id: string;
      username: string;
      name: string;
      avatar_url: string | null;
    };
    is_liked?: boolean;
  };
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  className?: string;
}

export const PostCard = ({ post, onLike, onDelete, className = '' }: PostCardProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user, toggleLike } = useUser();
  const { toast } = useToast();

  const isOwner = user?.id === post.user_id;

  const handleLike = async () => {
    if (onLike) {
      onLike(post.id);
    } else {
      await toggleLike(post.id);
    }
  };

  const handleBookmark = async () => {
    // This would integrate with a bookmark hook
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: isBookmarked ? 'Post removed from your bookmarks' : 'Post saved to your bookmarks',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.profiles.name} on Celestial`,
          text: post.content,
          url: `${window.location.origin}/post/${post.id}`,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        toast({
          title: 'Link copied!',
          description: 'Post link copied to clipboard',
        });
      } catch (error) {
        toast({
          title: 'Share failed',
          description: 'Could not copy link to clipboard',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  return (
    <Card className={`glass-effect border-border hover-lift ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={post.profiles.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-cosmic text-white">
              {post.profiles.name?.charAt(0) || post.profiles.username?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-accent truncate">
                  {post.profiles.name || post.profiles.username}
                </span>
                <span className="text-sm text-muted-foreground truncate">
                  @{post.profiles.username}
                </span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-accent"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="text-foreground whitespace-pre-wrap break-words">
                {post.content}
              </p>
            </div>

            {/* Image */}
            {post.image_url && (
              <div className="mb-3">
                <img
                  src={post.image_url}
                  alt="Post content"
                  className="w-full rounded-lg max-h-96 object-cover border border-border"
                  loading="lazy"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">0</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Comments</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto max-h-[60vh]">
                    <p className="text-center text-muted-foreground">Comments feature coming soon!</p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-green-500 transition-colors"
              >
                <Repeat className="w-4 h-4 mr-1" />
                <span className="text-xs">0</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`transition-colors ${
                  post.is_liked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-muted-foreground hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 mr-1 ${post.is_liked ? 'fill-current' : ''}`} />
                <span className="text-xs">0</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500 hover:text-yellow-600' 
                    : 'text-muted-foreground hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, Play, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSocialStore, type Bit } from '@/stores/socialStore';
import { useToast } from '@/hooks/use-toast';

interface BitCardProps {
  bit: Bit;
  onPlay: () => void;
}

export function BitCard({ bit, onPlay }: BitCardProps) {
  const { toggleLikeBit, toggleBookmarkBit, shareBit } = useSocialStore();
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeBit(bit.id);
    toast({
      description: bit.isLiked ? "Removed from favorites" : "Added to favorites ✨",
    });
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmarkBit(bit.id);
    toast({
      description: bit.isBookmarked ? "Removed from bookmarks" : "Bookmarked for later 🔖",
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareBit(bit.id);
    navigator.clipboard.writeText(`Check out this cosmic bit: ${bit.title}`);
    toast({
      description: "Link copied to clipboard! 🌟",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Card 
      className="cosmic-card group cursor-pointer hover:scale-105 transition-all duration-300"
      onClick={onPlay}
    >
      <CardContent className="p-0">
        <div className="relative aspect-[9/16] overflow-hidden rounded-t-lg">
          <img 
            src={bit.thumbnail} 
            alt={bit.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="cosmic-button p-4 rounded-full">
              <Play className="h-8 w-8 text-white fill-current" />
            </div>
          </div>
          
          {/* Duration badge */}
          <Badge className="absolute top-3 right-3 bg-black/70 text-white hover:bg-black/70">
            {bit.duration}
          </Badge>
          
          {/* Stats overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8 ring-2 ring-white/20">
                <AvatarImage src={bit.author.avatar} alt={bit.author.name} />
                <AvatarFallback className="bg-cosmic-gradient text-white text-xs">
                  {bit.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{bit.author.name}</span>
            </div>
            
            <h3 className="font-bold text-lg mb-1 line-clamp-2">{bit.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2 mb-3">{bit.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatViews(bit.views)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`p-2 hover:bg-white/20 ${
                    bit.isLiked ? 'text-cosmic-accent' : 'text-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${bit.isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1 text-xs">{bit.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="ml-1 text-xs">{bit.comments.length}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="p-2 text-white hover:bg-white/20"
                >
                  <Share className="h-4 w-4" />
                  <span className="ml-1 text-xs">{bit.shares}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`p-2 hover:bg-white/20 ${
                    bit.isBookmarked ? 'text-cosmic-accent' : 'text-white'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${bit.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
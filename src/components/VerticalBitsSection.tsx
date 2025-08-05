import { useState } from 'react';
import { Play, Heart, MessageCircle, Share, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Bit {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: any[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    displayName: string;
    username: string;
    avatar: string;
  };
}

interface VerticalBitsSectionProps {
  bits: Bit[];
  onBitClick: (bit: Bit) => void;
  loading: boolean;
}

const VerticalBitsSection = ({ bits, onBitClick, loading }: VerticalBitsSectionProps) => {
  const [hoveredBit, setHoveredBit] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-96 w-full max-w-xs mx-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (bits.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Bits Yet</h3>
        <p className="text-muted-foreground">
          Be the first to create a bit and share it with the cosmos!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {bits.map((bit) => (
        <Card
          key={bit.id}
          className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:scale-105 transition-all duration-300 animate-fade-in"
          onMouseEnter={() => setHoveredBit(bit.id)}
          onMouseLeave={() => setHoveredBit(null)}
          onClick={() => onBitClick(bit)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-[9/16] bg-gradient-to-br from-cosmic-purple/20 to-cosmic-blue/20 rounded-xl overflow-hidden h-48">
              {/* Video Thumbnail */}
              <video
                src={bit.videoUrl}
                poster={bit.thumbnail}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
                onMouseEnter={(e) => {
                  if (hoveredBit === bit.id) {
                    e.currentTarget.play();
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 hover:scale-110 transition-all duration-300"
                >
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </Button>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-2 right-2">
                <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded-full">
                  {bit.duration}
                </span>
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2">
                {/* Author Info */}
                <div className="flex items-center gap-1 mb-1">
                  <Avatar className="w-4 h-4 border border-white/20">
                    <AvatarImage src={bit.author?.avatar} />
                    <AvatarFallback className="bg-gradient-cosmic text-white text-xs">
                      {bit.author?.displayName?.charAt(0) || bit.author?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-xs font-medium truncate">
                    {bit.author?.displayName || bit.author?.username || 'Unknown User'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white text-xs font-semibold mb-1 line-clamp-1 leading-tight">
                  {bit.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center justify-between text-white/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5" />
                      {bit.likes}
                    </span>
                    <span>{bit.views} views</span>
                  </div>
                </div>
              </div>

              {/* Interaction Buttons (Right Side - Mobile Style) */}
              <div className="absolute right-1 bottom-12 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle like
                  }}
                >
                  <Heart className={`w-4 h-4 ${bit.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle comment
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle share
                  }}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VerticalBitsSection;
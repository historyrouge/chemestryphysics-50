import { useState } from 'react';
import { X, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  bit: {
    id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
    views: number;
    author: {
      displayName: string;
      username: string;
      avatar: string;
    };
  } | null;
}

const VideoModal = ({ isOpen, onClose, bit }: VideoModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!bit) return null;

  const handlePlayPause = () => {
    const video = document.getElementById('bit-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const video = document.getElementById('bit-video') as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none max-h-none w-screen h-screen p-0 bg-background border-0 overflow-hidden animate-fade-in">
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-background via-card to-cosmic-purple/20">
          {/* Video Container */}
          <div className="relative w-full max-w-sm h-full max-h-screen bg-black rounded-none md:rounded-2xl overflow-hidden glass-effect border border-cosmic-accent/20">
            {/* Video */}
            <video
              id="bit-video"
              src={bit.videoUrl}
              poster={bit.thumbnail}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onLoadedData={() => setIsPlaying(true)}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent via-30% to-black/90 flex flex-col transition-opacity duration-300">
              {/* Top Controls */}
              <div className="flex justify-between items-center p-6 text-white">
                <div className="flex items-center gap-3 animate-slide-up">
                  <Avatar className="w-10 h-10 ring-2 ring-cosmic-accent/40 hover:ring-cosmic-accent/60 transition-all">
                    <AvatarImage src={bit.author.avatar} alt={bit.author.displayName} />
                    <AvatarFallback className="bg-gradient-cosmic text-white font-semibold">
                      {bit.author.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-base text-foreground">{bit.author.displayName}</p>
                    <p className="text-sm text-cosmic-accent">@{bit.author.username}</p>
                  </div>
                </div>
                <Button
                  variant="glass"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 hover:scale-110 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Center Play Button */}
              <div className="flex-1 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 hover:scale-110 transition-all duration-300 border border-white/20 cosmic-glow"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10" />
                  ) : (
                    <Play className="w-10 h-10 ml-1" />
                  )}
                </Button>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-24 flex flex-col gap-4">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={handleMute}
                  className="w-12 h-12 rounded-full text-white hover:bg-white/10 hover:scale-110 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Bottom Info */}
              <div className="p-6 text-white space-y-3 animate-slide-up">
                <h3 className="font-bold text-lg text-foreground leading-tight">{bit.title}</h3>
                {bit.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {bit.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-cosmic-accent">
                    <span className="bg-cosmic-accent/20 px-2 py-1 rounded-full backdrop-blur-sm">
                      {bit.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
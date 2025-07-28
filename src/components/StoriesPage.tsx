import { useState, useEffect } from 'react';
import { Play, Plus, Clock, Eye, Heart, MessageCircle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface StoriesPageProps {
  onNavigate?: (page: string) => void;
}

interface Story {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
  expiresAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  };
  isViewed?: boolean;
  isOwn?: boolean;
}

const StoriesPage = ({ onNavigate }: StoriesPageProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStoryForm, setNewStoryForm] = useState({
    mediaUrl: '',
    caption: '',
    mediaType: 'image' as 'image' | 'video'
  });

  useEffect(() => {
    // Initialize with mock stories data
    const mockStories: Story[] = [
      {
        id: '1',
        author: {
          name: 'Cosmic Explorer',
          username: 'cosmicexplorer',
          avatar: '/placeholder.svg',
          verified: true
        },
        mediaUrl: '/placeholder.svg',
        mediaType: 'image',
        caption: 'Amazing aurora display tonight! 🌌✨',
        timestamp: '2h ago',
        expiresAt: '22h remaining',
        metrics: {
          views: 1250,
          likes: 89,
          comments: 23
        },
        isViewed: false,
        isOwn: false
      },
      {
        id: '2',
        author: {
          name: 'Star Gazer',
          username: 'stargazer',
          avatar: '/placeholder.svg'
        },
        mediaUrl: '/placeholder.svg',
        mediaType: 'video',
        caption: 'Saturn through my telescope 🔭',
        timestamp: '4h ago',
        expiresAt: '20h remaining',
        metrics: {
          views: 890,
          likes: 67,
          comments: 12
        },
        isViewed: true,
        isOwn: false
      },
      {
        id: '3',
        author: {
          name: 'You',
          username: 'currentuser',
          avatar: '/placeholder.svg'
        },
        mediaUrl: '/placeholder.svg',
        mediaType: 'image',
        caption: 'My setup for tonight\'s observation session',
        timestamp: '6h ago',
        expiresAt: '18h remaining',
        metrics: {
          views: 456,
          likes: 34,
          comments: 8
        },
        isViewed: true,
        isOwn: true
      }
    ];
    setStories(mockStories);
  }, []);

  const handleStoryClick = (story: Story, index: number) => {
    setSelectedStory(story);
    setCurrentStoryIndex(index);
    
    // Mark as viewed
    if (!story.isViewed) {
      setStories(prev => prev.map(s => 
        s.id === story.id ? { ...s, isViewed: true } : s
      ));
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
      setSelectedStory(stories[nextIndex]);
      
      // Mark as viewed
      if (!stories[nextIndex].isViewed) {
        setStories(prev => prev.map(s => 
          s.id === stories[nextIndex].id ? { ...s, isViewed: true } : s
        ));
      }
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevIndex);
      setSelectedStory(stories[prevIndex]);
    }
  };

  const handleCreateStory = () => {
    const newStory: Story = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        username: 'currentuser',
        avatar: '/placeholder.svg'
      },
      mediaUrl: newStoryForm.mediaUrl || '/placeholder.svg',
      mediaType: newStoryForm.mediaType,
      caption: newStoryForm.caption,
      timestamp: 'now',
      expiresAt: '24h remaining',
      metrics: {
        views: 0,
        likes: 0,
        comments: 0
      },
      isViewed: true,
      isOwn: true
    };

    setStories(prev => [newStory, ...prev]);
    setShowCreateDialog(false);
    setNewStoryForm({ mediaUrl: '', caption: '', mediaType: 'image' });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Cosmic Stories
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your celestial moments that disappear in 24 hours
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Create Story Card */}
          <Card 
            className="glass-effect hover-lift cursor-pointer aspect-[3/4]"
            onClick={() => setShowCreateDialog(true)}
          >
            <CardContent className="p-0 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium">Create Story</span>
            </CardContent>
          </Card>

          {/* Story Cards */}
          {stories.map((story, index) => (
            <Card 
              key={story.id}
              className={`glass-effect hover-lift cursor-pointer aspect-[3/4] relative overflow-hidden ${
                !story.isViewed ? 'ring-2 ring-primary' : 'opacity-75'
              }`}
              onClick={() => handleStoryClick(story, index)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              {story.mediaType === 'video' && (
                <div className="absolute top-3 right-3 z-20">
                  <Play className="h-5 w-5 text-white" />
                </div>
              )}
              <img 
                src={story.mediaUrl} 
                alt="Story"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8 ring-2 ring-white">
                    <AvatarImage src={story.author.avatar} />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white text-sm font-medium">{story.author.name}</p>
                    <p className="text-white/80 text-xs">{story.timestamp}</p>
                  </div>
                </div>
                {story.isOwn && (
                  <div className="flex items-center gap-3 text-white/80 text-xs">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(story.metrics.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(story.metrics.likes)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Story Viewer Dialog */}
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="max-w-md p-0 bg-black border-none">
            {selectedStory && (
              <div className="relative h-[80vh] flex flex-col">
                {/* Story Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-30 flex gap-1">
                  {stories.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1 flex-1 rounded-full ${
                        index <= currentStoryIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Story Header */}
                <div className="absolute top-8 left-4 right-4 z-30 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white">
                      <AvatarImage src={selectedStory.author.avatar} />
                      <AvatarFallback>{selectedStory.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">{selectedStory.author.name}</p>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Clock className="h-3 w-3" />
                        {selectedStory.expiresAt}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStory(null)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Story Content */}
                <div 
                  className="flex-1 relative cursor-pointer"
                  onClick={handleNextStory}
                >
                  {/* Navigation Areas */}
                  <div 
                    className="absolute left-0 top-0 w-1/3 h-full z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevStory();
                    }}
                  />
                  <div 
                    className="absolute right-0 top-0 w-1/3 h-full z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextStory();
                    }}
                  />

                  {selectedStory.mediaType === 'video' ? (
                    <video 
                      src={selectedStory.mediaUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                    />
                  ) : (
                    <img 
                      src={selectedStory.mediaUrl}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Story Caption */}
                  {selectedStory.caption && (
                    <div className="absolute bottom-4 left-4 right-4 z-30">
                      <p className="text-white bg-black/50 rounded-lg p-3">
                        {selectedStory.caption}
                      </p>
                    </div>
                  )}
                </div>

                {/* Story Metrics (for own stories) */}
                {selectedStory.isOwn && (
                  <div className="absolute bottom-20 left-4 right-4 z-30">
                    <div className="flex items-center justify-center gap-6 bg-black/50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-white">
                        <Eye className="h-4 w-4" />
                        {formatNumber(selectedStory.metrics.views)}
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <Heart className="h-4 w-4" />
                        {formatNumber(selectedStory.metrics.likes)}
                      </div>
                      <div className="flex items-center gap-1 text-white">
                        <MessageCircle className="h-4 w-4" />
                        {formatNumber(selectedStory.metrics.comments)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Story Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Story</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Media URL</label>
                <Input
                  placeholder="Enter image or video URL"
                  value={newStoryForm.mediaUrl}
                  onChange={(e) => setNewStoryForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Caption</label>
                <Textarea
                  placeholder="Add a caption to your story..."
                  value={newStoryForm.caption}
                  onChange={(e) => setNewStoryForm(prev => ({ ...prev, caption: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Media Type</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={newStoryForm.mediaType === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewStoryForm(prev => ({ ...prev, mediaType: 'image' }))}
                  >
                    Image
                  </Button>
                  <Button
                    variant={newStoryForm.mediaType === 'video' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewStoryForm(prev => ({ ...prev, mediaType: 'video' }))}
                  >
                    Video
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateStory} className="flex-1">
                  Create Story
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoriesPage;
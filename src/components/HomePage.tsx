import { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  Menu, 
  X, 
  Home, 
  User, 
  Bell, 
  MessageCircle, 
  Heart, 
  Repeat, 
  Share, 
  Image as ImageIcon, 
  Video, 
  Smile, 
  Play,
  Users,
  Settings,
  LogOut,
  Verified,
  Plus,
  Upload,
  Bookmark,
  Compass,
  Mail,
  Loader2
} from 'lucide-react';
import StarField from './StarField';
import VideoModal from './VideoModal';
import { PostCard } from '@/components/PostCard';
import { BitCard } from '@/components/BitCard';
import { SearchModal } from '@/components/SearchModal';
import NotificationCenter from '@/components/NotificationCenter';
import CreatePostModal from '@/components/CreatePostModal';
import UploadOptionsMenu from '@/components/UploadOptionsMenu';
import BitUploadModal from '@/components/BitUploadModal';
import StoryUploadModal from '@/components/StoryUploadModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useSocialStore } from '@/stores/socialStore';
import { formatDistanceToNow } from 'date-fns';

interface HomePageProps {
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
  onOpenUpload?: (type: 'post' | 'bit') => void;
}

const HomePage = ({ onLogout, onNavigate, onOpenUpload }: HomePageProps) => {
  const { 
    user, 
    profile, 
    posts, 
    postsLoading, 
    hasMorePosts, 
    createPost, 
    toggleLike, 
    loadMorePosts, 
    refreshPosts,
    logout 
  } = useUser();
  
  const { bits, initializeMockData } = useSocialStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [quickPostText, setQuickPostText] = useState('');
  const [selectedBit, setSelectedBit] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [isBitUploadOpen, setIsBitUploadOpen] = useState(false);
  const [isStoryUploadOpen, setIsStoryUploadOpen] = useState(false);

  const handleQuickPost = async () => {
    if (quickPostText.trim()) {
      const result = await createPost(quickPostText);
      if (result.success) {
        setQuickPostText('');
      }
    }
  };

  const handleBitClick = (bit: any) => {
    setSelectedBit(bit);
    setIsVideoModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    if (onLogout) onLogout();
  };

  const handleUploadOption = (type: 'post' | 'bit' | 'story') => {
    switch (type) {
      case 'post':
        setIsCreatePostOpen(true);
        break;
      case 'bit':
        setIsBitUploadOpen(true);
        break;
      case 'story':
        setIsStoryUploadOpen(true);
        break;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    if (hasMorePosts && !postsLoading) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMorePosts, postsLoading]);

  useEffect(() => {
    // Initialize mock data for bits and stories
    initializeMockData();
  }, [initializeMockData]);

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      {/* Mobile-optimized main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10 pb-20">
        {/* Mobile Dashboard Stats */}
        <div className="mb-6 md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-effect p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="text-lg font-bold">1.2K</p>
                </div>
              </div>
            </div>
            <div className="glass-effect p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="text-lg font-bold">8.4K</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Post */}
        <Card className="glass-effect mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-cosmic text-white">
                  {profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={quickPostText}
                  onChange={(e) => setQuickPostText(e.target.value)}
                  placeholder="What's happening in the cosmos?"
                  className="min-h-[80px] bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  maxLength={280}
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatePostOpen(true)}
                      className="text-accent hover:text-accent/80"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent/80"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {quickPostText.length}/280
                    </span>
                    <Button
                      onClick={handleQuickPost}
                      disabled={!quickPostText.trim()}
                      size="sm"
                      variant="cosmic"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-4">
          {postsLoading && posts.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Loading your cosmic feed...</p>
            </div>
          ) : (
            <>
              {/* Posts */}
              {posts.map((post) => (
                <Card key={post.id} className="glass-effect">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={post.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-cosmic text-white">
                          {post.profiles?.name?.charAt(0) || post.profiles?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-accent">
                            {post.profiles?.name || post.profiles?.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            @{post.profiles?.username}
                          </span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-foreground mb-3 whitespace-pre-wrap">
                          {post.content}
                        </p>
                        
                        {post.image_url && (
                          <div className="mb-3">
                            <img
                              src={post.image_url}
                              alt="Post content"
                              className="w-full rounded-lg max-h-96 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            0
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-green-500"
                          >
                            <Repeat className="w-4 h-4 mr-1" />
                            0
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className={`${post.is_liked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.is_liked ? 'fill-current' : ''}`} />
                            0
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Bits */}
              {bits.map((bit) => (
                <Card key={bit.id} className="glass-effect">
                  <CardContent className="p-0">
                    <div className="relative">
                      <video 
                        src={bit.videoUrl}
                        poster={bit.thumbnail}
                        className="w-full h-64 object-cover rounded-t-lg"
                        onClick={() => handleBitClick(bit)}
                        muted
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBitClick(bit)}
                        className="absolute inset-0 bg-black/20 hover:bg-black/40 text-white"
                      >
                        <Play className="w-12 h-12" />
                      </Button>
                      
                      {/* Bit overlay info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={bit.author.avatar} />
                            <AvatarFallback className="bg-gradient-cosmic text-white text-xs">
                              {bit.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-white font-medium text-sm">{bit.author.name}</span>
                          <span className="text-white/70 text-xs">@{bit.author.username}</span>
                        </div>
                        <h3 className="text-white font-semibold mb-1">{bit.title}</h3>
                        {bit.description && (
                          <p className="text-white/80 text-sm mb-2 line-clamp-2">{bit.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-white/70 text-xs">
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {bit.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {bit.likes}
                          </span>
                          <span>{bit.views} views</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Load More */}
              {hasMorePosts && (
                <div className="text-center py-4">
                  <Button
                    onClick={loadMorePosts}
                    disabled={postsLoading}
                    variant="ghost"
                    className="text-accent hover:text-accent/80"
                  >
                    {postsLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more posts'
                    )}
                  </Button>
                </div>
              )}
              
              {posts.length === 0 && !postsLoading && (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-lg font-semibold text-accent mb-2">Welcome to Neon!</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your cosmic journey by creating your first post or following other users.
                  </p>
                  <Button
                    onClick={() => setIsCreatePostOpen(true)}
                    variant="cosmic"
                  >
                    Create Your First Post
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsUploadMenuOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-gradient-cosmic hover:shadow-glow-primary z-40 md:hidden"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modals */}
      <UploadOptionsMenu
        isOpen={isUploadMenuOpen}
        onClose={() => setIsUploadMenuOpen(false)}
        onSelectOption={handleUploadOption}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <BitUploadModal
        isOpen={isBitUploadOpen}
        onClose={() => setIsBitUploadOpen(false)}
      />

      <StoryUploadModal
        isOpen={isStoryUploadOpen}
        onClose={() => setIsStoryUploadOpen(false)}
      />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        bit={selectedBit}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationCenter />
    </div>
  );
};

export default HomePage;
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
  Loader2,
  ArrowUp,
  Reply
} from 'lucide-react';
import StarField from './StarField';
import VideoModal from './VideoModal';
import VerticalBitsSection from './VerticalBitsSection';
import { SearchModal } from '@/components/SearchModal';
import NotificationCenter from '@/components/NotificationCenter';
import CreatePostModal from '@/components/CreatePostModal';
import UploadOptionsMenu from '@/components/UploadOptionsMenu';
import BitUploadModal from '@/components/BitUploadModal';
import StoryUploadModal from '@/components/StoryUploadModal';
import PostReplyModal from '@/components/PostReplyModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
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
  
  // Real data state for bits and stories
  const [bits, setBits] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [bitsLoading, setBitsLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  
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
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const handleReplyToPost = (post: any) => {
    setSelectedPost(post);
    setIsReplyModalOpen(true);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Fetch real bits data from database
  const fetchBits = async () => {
    try {
      setBitsLoading(true);
      
      // Direct query to bits table
      const { data: bitsData, error: bitsError } = await supabase
        .from('bits' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (bitsError) {
        console.log('No bits found or error fetching bits:', bitsError);
        setBits([]);
        setBitsLoading(false);
        return;
      }

      // Transform bits data for display
      const transformedBits = (bitsData || []).map((bit: any) => ({
        id: bit.id,
        title: bit.title,
        description: bit.description,
        videoUrl: bit.video_url,
        thumbnail: bit.video_url, // Using video URL as thumbnail for now
        duration: '0:30', // Default duration
        views: 1250, // Mock view count
        likes: 89, // Mock like count
        comments: [],
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        author: {
          displayName: 'Guest User',
          username: 'guest_user',
          avatar: '/placeholder.svg',
        },
      }));

      setBits(transformedBits);
    } catch (error) {
      console.log('Error fetching bits:', error);
      setBits([]);
    } finally {
      setBitsLoading(false);
    }
  };

  // Fetch real stories data from database
  const fetchStories = async () => {
    try {
      setStoriesLoading(true);
      
      // Direct query to stories table
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (storiesError) {
        console.log('No stories found or error fetching stories:', storiesError);
        setStories([]);
        setStoriesLoading(false);
        return;
      }

      // Transform stories data for display
      const transformedStories = (storiesData || []).map((story: any) => ({
        id: story.id,
        title: story.title,
        content: story.content,
        mediaUrl: story.media_url,
        author: {
          name: 'Guest User',
          avatar: '/placeholder.svg',
          username: 'guest_user',
        },
        timestamp: formatDistanceToNow(new Date(story.created_at), { addSuffix: true }),
        expiresAt: '24h remaining',
        views: 1250,
        isOwn: false,
      }));

      setStories(transformedStories);
    } catch (error) {
      console.log('Error fetching stories:', error);
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchBits();
    fetchStories();
  }, []);

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
        <Card className="glass-effect cosmic-glow border border-accent/30 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-accent/30">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-cosmic text-white">
                  {profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  value={quickPostText}
                  onChange={(e) => setQuickPostText(e.target.value)}
                  placeholder="✨ Share your cosmic thoughts with the universe..."
                  className="min-h-[120px] resize-none bg-input/60 border-accent/20 focus:border-accent text-lg leading-relaxed"
                  maxLength={280}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreatePostOpen(true)}
                      className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 p-2 rounded-full"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 p-2 rounded-full"
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 p-2 rounded-full"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">
                      {quickPostText.length}/280
                    </span>
                  </div>
                  <Button
                    onClick={handleQuickPost}
                    disabled={!quickPostText.trim()}
                    size="lg"
                    variant="cosmic"
                    className="px-8 py-2 text-base font-semibold"
                  >
                    Share to Universe ✨
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Your post will be visible to explorers across the cosmic network 🌍
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-4">
          {(postsLoading || bitsLoading) && posts.length === 0 && bits.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Loading your cosmic feed...</p>
            </div>
          ) : (
            <>
              {/* Posts */}
              {posts.map((post) => (
                <Card key={`post-${post.id}`} className="glass-effect cosmic-glow hover-lift transition-all duration-300 border border-accent/20 hover:border-accent/40">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-accent/30">
                        <AvatarImage src={post.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-cosmic text-white">
                          {post.profiles?.name?.charAt(0) || post.profiles?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-accent hover:text-accent/80 cursor-pointer">
                            {post.profiles?.name || post.profiles?.username}
                          </span>
                          {post.profiles?.verified && (
                            <Verified className="w-4 h-4 text-blue-400 fill-current" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            @{post.profiles?.username}
                          </span>
                          <span className="text-sm text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground hover:text-accent cursor-pointer">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            Public
                          </Badge>
                        </div>
                        
                        <div 
                          className="text-foreground leading-relaxed whitespace-pre-wrap cursor-pointer hover:text-accent/90 transition-colors"
                          onClick={() => handleReplyToPost(post)}
                        >
                          {post.content}
                        </div>
                        
                        {post.image_url && (
                          <div className="my-4">
                            <img
                              src={post.image_url}
                              alt="Post content"
                              className="w-full rounded-xl max-h-96 object-cover border border-accent/20 hover:border-accent/40 transition-colors cursor-pointer"
                              onClick={() => handleReplyToPost(post)}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-accent/10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReplyToPost(post)}
                            className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-full"
                          >
                            <Reply className="w-4 h-4" />
                            <span className="text-sm font-medium">Reply</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-green-500 hover:bg-green-500/10 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-full"
                          >
                            <Repeat className="w-4 h-4" />
                            <span className="text-sm font-medium">0</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(post.id)}
                            className={`${post.is_liked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'} transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-full`}
                          >
                            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">{post.likes_count || 0}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-full"
                          >
                            <Share className="w-4 h-4" />
                            <span className="text-sm font-medium">Share</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 p-2 rounded-full"
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Vertical Bits Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-accent flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Bits
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsBitUploadOpen(true)}
                    className="text-cosmic-accent hover:text-cosmic-accent/80"
                  >
                    Create Bit
                  </Button>
                </div>
                <VerticalBitsSection
                  bits={bits}
                  onBitClick={handleBitClick}
                  loading={bitsLoading}
                />
              </div>
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
              
              {posts.length === 0 && bits.length === 0 && !postsLoading && !bitsLoading && (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-lg font-semibold text-accent mb-2">Welcome to Neon!</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your cosmic journey by creating your first post, bit, or story.
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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={handleScrollToTop}
          className="fixed bottom-32 right-4 w-12 h-12 rounded-full bg-gradient-cosmic hover:shadow-glow-primary z-40 animate-fade-in"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

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

      <PostReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        post={selectedPost}
      />

      <BitUploadModal
        isOpen={isBitUploadOpen}
        onClose={() => setIsBitUploadOpen(false)}
        onSuccess={fetchBits}
      />

      <StoryUploadModal
        isOpen={isStoryUploadOpen}
        onClose={() => setIsStoryUploadOpen(false)}
        onSuccess={fetchStories}
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
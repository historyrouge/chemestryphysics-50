import { ArrowLeft, Search, TrendingUp, Users, Hash, Globe } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarField from './StarField';

interface ExplorePageProps {
  onNavigateBack: () => void;
}

const ExplorePage = ({ onNavigateBack }: ExplorePageProps) => {
  const [activeTab, setActiveTab] = useState('trending');

  const trendingTopics = [
    { tag: '#BlackHole', posts: 12500, trend: '+25%' },
    { tag: '#Mars2024', posts: 8300, trend: '+42%' },
    { tag: '#Nebula', posts: 6700, trend: '+15%' },
    { tag: '#SpaceX', posts: 15200, trend: '+8%' },
    { tag: '#Astronomy', posts: 9800, trend: '+33%' }
  ];

  const suggestedUsers = [
    {
      id: 1,
      name: 'NASA Space Center',
      username: 'nasaspace',
      avatar: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=40&h=40&fit=crop',
      bio: 'Official NASA space exploration updates',
      followers: 2500000,
      verified: true
    },
    {
      id: 2,
      name: 'Astrophoto Daily',
      username: 'astrophoto_daily',
      avatar: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=40&h=40&fit=crop',
      bio: 'Daily space photography and cosmic wonders',
      followers: 158000,
      verified: false
    },
    {
      id: 3,
      name: 'Space Explorer',
      username: 'space_explorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      bio: 'Exploring the mysteries of the universe',
      followers: 89500,
      verified: false
    }
  ];

  const popularPosts = [
    {
      id: 1,
      content: 'Just captured this amazing shot of the Andromeda Galaxy! The detail you can see with modern telescopes is incredible.',
      author: { name: 'StarGazer Pro', username: 'stargazer_pro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop' },
      image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop',
      likes: 2847,
      reposts: 451,
      comments: 128
    },
    {
      id: 2,
      content: 'Mars is looking particularly beautiful tonight. The red planet never fails to amaze me! 🔴',
      author: { name: 'Cosmic Wanderer', username: 'cosmic_wanderer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86d85ba?w=40&h=40&fit=crop' },
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&h=300&fit=crop',
      likes: 1923,
      reposts: 287,
      comments: 94
    }
  ];

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 glass-effect border-b border-border z-20">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Explore</h1>
              <p className="text-sm text-muted-foreground">Discover cosmic content</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for topics, people, or posts..."
              className="pl-10 bg-input/50 border-border focus:border-accent"
            />
          </div>

          {/* Tabs */}
          <div className="flex mb-6 glass-effect rounded-xl p-1">
            {[
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'people', label: 'People', icon: Users },
              { id: 'topics', label: 'Topics', icon: Hash },
              { id: 'posts', label: 'Posts', icon: Globe }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-cosmic text-white shadow-glow-primary'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'trending' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
                  {trendingTopics.map((topic, index) => (
                    <Card key={index} className="glass-effect border-border hover:bg-card/90 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-accent">{topic.tag}</h3>
                            <p className="text-sm text-muted-foreground">{topic.posts.toLocaleString()} posts</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-green-500">{topic.trend}</span>
                            <TrendingUp className="w-4 h-4 text-green-500 inline ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'people' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Suggested for You</h2>
                  {suggestedUsers.map((user) => (
                    <Card key={user.id} className="glass-effect border-border hover:bg-card/90 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{user.name}</h3>
                              {user.verified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                            <p className="text-sm mb-2">{user.bio}</p>
                            <p className="text-xs text-muted-foreground">{user.followers.toLocaleString()} followers</p>
                          </div>
                          <Button variant="outline" size="sm">Follow</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'posts' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Popular Posts</h2>
                  {popularPosts.map((post) => (
                    <Card key={post.id} className="glass-effect border-border hover:bg-card/90 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.author.avatar} alt={post.author.name} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{post.author.name}</span>
                              <span className="text-muted-foreground">@{post.author.username}</span>
                            </div>
                            <p className="text-foreground mb-3">{post.content}</p>
                            {post.image && (
                              <img 
                                src={post.image} 
                                alt="Post content"
                                className="rounded-lg max-w-full h-auto mb-3 border border-border/50"
                              />
                            )}
                            <div className="flex gap-6 text-muted-foreground text-sm">
                              <span>{post.likes} likes</span>
                              <span>{post.reposts} reposts</span>
                              <span>{post.comments} comments</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="glass-effect border-border">
                <CardHeader>
                  <h3 className="font-semibold">What's Happening</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="cursor-pointer hover:bg-accent/10 p-2 rounded">
                    <p className="font-semibold text-sm">Solar Eclipse 2024</p>
                    <p className="text-xs text-muted-foreground">Trending in Astronomy</p>
                  </div>
                  <div className="cursor-pointer hover:bg-accent/10 p-2 rounded">
                    <p className="font-semibold text-sm">James Webb Discovery</p>
                    <p className="text-xs text-muted-foreground">1,247 posts</p>
                  </div>
                  <div className="cursor-pointer hover:bg-accent/10 p-2 rounded">
                    <p className="font-semibold text-sm">Mars Rover Update</p>
                    <p className="text-xs text-muted-foreground">Trending</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-border">
                <CardHeader>
                  <h3 className="font-semibold">Who to Follow</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestedUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                      </div>
                      <Button variant="outline" size="sm">Follow</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
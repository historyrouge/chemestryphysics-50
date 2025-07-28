import { useState } from 'react';
import { TrendingUp, Hash, MapPin, Calendar, Eye, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TrendingPageProps {
  onNavigate?: (page: string) => void;
}

interface TrendingTopic {
  id: string;
  tag: string;
  category: string;
  posts: number;
  growth: number;
  description?: string;
}

interface TrendingPost {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  trending_score: number;
  location?: string;
  timestamp: string;
}

const TrendingPage = ({ onNavigate }: TrendingPageProps) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'posts' | 'locations'>('topics');

  const trendingTopics: TrendingTopic[] = [
    {
      id: '1',
      tag: 'SpaceExploration',
      category: 'Science',
      posts: 15420,
      growth: 45.2,
      description: 'Latest discoveries in space exploration and astronomy'
    },
    {
      id: '2',
      tag: 'CosmicPhotography',
      category: 'Art',
      posts: 8930,
      growth: 32.1,
      description: 'Stunning images of the cosmos and celestial events'
    },
    {
      id: '3',
      tag: 'StarGazing',
      category: 'Lifestyle',
      posts: 12340,
      growth: 28.7,
      description: 'Tips and experiences from amateur astronomers'
    },
    {
      id: '4',
      tag: 'NebulaNights',
      category: 'Community',
      posts: 6750,
      growth: 67.3,
      description: 'Community events and nebula observation meetups'
    },
    {
      id: '5',
      tag: 'AstroTech',
      category: 'Technology',
      posts: 4560,
      growth: 89.1,
      description: 'Latest telescope tech and space equipment reviews'
    }
  ];

  const trendingPosts: TrendingPost[] = [
    {
      id: '1',
      content: 'Just witnessed the most incredible aurora display! The cosmic dance of lights was absolutely mesmerizing ✨🌌',
      author: {
        name: 'Aurora Hunter',
        username: 'aurorahunter',
        avatar: '/placeholder.svg',
        verified: true
      },
      metrics: {
        views: 45670,
        likes: 3240,
        comments: 567,
        shares: 892
      },
      trending_score: 94.5,
      location: 'Northern Alaska',
      timestamp: '2h ago'
    },
    {
      id: '2',
      content: 'Breaking: New exoplanet discovered in the habitable zone! This could change everything we know about life beyond Earth 🪐',
      author: {
        name: 'Dr. Stella Observatory',
        username: 'stellaobs',
        avatar: '/placeholder.svg',
        verified: true
      },
      metrics: {
        views: 78900,
        likes: 5670,
        comments: 1234,
        shares: 2340
      },
      trending_score: 98.2,
      timestamp: '4h ago'
    },
    {
      id: '3',
      content: 'Captured Saturn through my home telescope last night. The rings are so clear you can see the Cassini Division! 🔭',
      author: {
        name: 'Backyard Astronomer',
        username: 'backyardastro',
        avatar: '/placeholder.svg'
      },
      metrics: {
        views: 23400,
        likes: 1890,
        comments: 234,
        shares: 456
      },
      trending_score: 87.3,
      location: 'Colorado, USA',
      timestamp: '6h ago'
    }
  ];

  const trendingLocations = [
    { name: 'Atacama Desert, Chile', posts: 2340, category: 'Dark Sky Sanctuary' },
    { name: 'Mauna Kea, Hawaii', posts: 1890, category: 'Observatory Hub' },
    { name: 'Northern Lights Zone', posts: 3450, category: 'Aurora Viewing' },
    { name: 'Sahara Desert', posts: 1230, category: 'Stargazing Paradise' },
    { name: 'ISS Live Stream', posts: 4560, category: 'Space Station' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending in the Cosmos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what's capturing the universe's attention right now
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="glass-effect rounded-lg p-1 inline-flex">
            <Button
              variant={activeTab === 'topics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('topics')}
              className="gap-2"
            >
              <Hash className="h-4 w-4" />
              Topics
            </Button>
            <Button
              variant={activeTab === 'posts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('posts')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Posts
            </Button>
            <Button
              variant={activeTab === 'locations' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('locations')}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Locations
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'topics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTopics.map((topic, index) => (
              <Card key={topic.id} className="glass-effect hover-lift cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1} {topic.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">+{topic.growth}%</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    {topic.tag}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3">
                    {topic.description}
                  </p>
                  <div className="text-sm text-foreground font-medium">
                    {formatNumber(topic.posts)} posts
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {trendingPosts.map((post, index) => (
              <Card key={post.id} className="glass-effect hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-medium">{post.trending_score}%</span>
                      </div>
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-muted-foreground">@{post.author.username}</span>
                        {post.author.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                        <span className="text-muted-foreground text-sm">•</span>
                        <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                      </div>
                      <p className="text-foreground mb-3">{post.content}</p>
                      {post.location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                          <MapPin className="h-3 w-3" />
                          {post.location}
                        </div>
                      )}
                      <div className="flex items-center gap-6 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatNumber(post.metrics.views)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {formatNumber(post.metrics.likes)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {formatNumber(post.metrics.comments)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingLocations.map((location, index) => (
              <Card key={location.name} className="glass-effect hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {location.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {location.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {formatNumber(location.posts)} posts from this location
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
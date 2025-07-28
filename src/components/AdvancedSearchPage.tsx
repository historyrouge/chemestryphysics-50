import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Hash, 
  MapPin, 
  Star,
  TrendingUp,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface AdvancedSearchPageProps {
  onNavigate?: (page: string) => void;
}

interface SearchFilters {
  query: string;
  type: 'all' | 'posts' | 'bits' | 'users' | 'hashtags';
  dateRange: 'any' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'recent' | 'popular' | 'trending';
  minLikes: number;
  minComments: number;
  verified: boolean;
  hasMedia: boolean;
  location: string;
}

interface SearchResult {
  id: string;
  type: 'post' | 'bit' | 'user' | 'hashtag';
  content?: string;
  author?: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
    followers?: number;
  };
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  timestamp?: string;
  hashtag?: string;
  postsCount?: number;
  mediaUrl?: string;
  location?: string;
  trending?: boolean;
}

const AdvancedSearchPage = ({ onNavigate }: AdvancedSearchPageProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    dateRange: 'any',
    sortBy: 'relevance',
    minLikes: 0,
    minComments: 0,
    verified: false,
    hasMedia: false,
    location: ''
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchPerformed(true);
    
    // Simulate search delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          content: 'Amazing aurora borealis display captured last night! The cosmic dance of lights was absolutely mesmerizing ✨🌌',
          author: {
            name: 'Aurora Hunter',
            username: 'aurorahunter',
            avatar: '/placeholder.svg',
            verified: true,
            followers: 15400
          },
          metrics: {
            likes: 2340,
            comments: 567,
            shares: 892,
            views: 12500
          },
          timestamp: '2h ago',
          location: 'Northern Alaska',
          trending: true
        },
        {
          id: '2',
          type: 'user',
          author: {
            name: 'Dr. Stella Observatory',
            username: 'stellaobs',
            avatar: '/placeholder.svg',
            verified: true,
            followers: 89500
          }
        },
        {
          id: '3',
          type: 'bit',
          content: 'Saturn through my 8-inch telescope - you can clearly see the Cassini Division!',
          author: {
            name: 'Backyard Astronomer',
            username: 'backyardastro',
            avatar: '/placeholder.svg',
            followers: 5600
          },
          metrics: {
            likes: 1560,
            comments: 234,
            shares: 167,
            views: 8900
          },
          timestamp: '6h ago',
          mediaUrl: '/placeholder.svg',
          location: 'Colorado, USA'
        },
        {
          id: '4',
          type: 'hashtag',
          hashtag: 'SpacePhotography',
          postsCount: 125600,
          trending: true
        },
        {
          id: '5',
          type: 'hashtag',
          hashtag: 'AuroraHunting',
          postsCount: 34500,
          trending: true
        }
      ];
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderSearchResult = (result: SearchResult) => {
    switch (result.type) {
      case 'post':
      case 'bit':
        return (
          <Card key={result.id} className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={result.author?.avatar} />
                  <AvatarFallback>{result.author?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{result.author?.name}</span>
                    <span className="text-muted-foreground">@{result.author?.username}</span>
                    {result.author?.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                    {result.trending && (
                      <Badge variant="destructive" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {result.type === 'post' ? 'Post' : 'Bit'}
                    </Badge>
                  </div>
                  <p className="text-foreground mb-3">{result.content}</p>
                  {result.location && (
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <MapPin className="h-3 w-3" />
                      {result.location}
                    </div>
                  )}
                  <div className="flex items-center gap-6 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(result.metrics?.views || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {formatNumber(result.metrics?.likes || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {formatNumber(result.metrics?.comments || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      {formatNumber(result.metrics?.shares || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {result.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'user':
        return (
          <Card key={result.id} className="glass-effect hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={result.author?.avatar} />
                  <AvatarFallback>{result.author?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{result.author?.name}</h3>
                    {result.author?.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">@{result.author?.username}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {formatNumber(result.author?.followers || 0)} followers
                    </span>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'hashtag':
        return (
          <Card key={result.id} className="glass-effect hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">#{result.hashtag}</h3>
                    {result.trending && (
                      <Badge variant="destructive" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {formatNumber(result.postsCount || 0)} posts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            Advanced Search
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find exactly what you're looking for in the cosmic social sphere
          </p>
        </div>

        {/* Search Filters */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter your search query..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Filter Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content</SelectItem>
                    <SelectItem value="posts">Posts</SelectItem>
                    <SelectItem value="bits">Bits</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                    <SelectItem value="hashtags">Hashtags</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value: any) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter location..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Likes: {filters.minLikes}</label>
                <Slider
                  value={[filters.minLikes]}
                  onValueChange={([value]) => setFilters(prev => ({ ...prev, minLikes: value }))}
                  max={10000}
                  step={100}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Comments: {filters.minComments}</label>
                <Slider
                  value={[filters.minComments]}
                  onValueChange={([value]) => setFilters(prev => ({ ...prev, minComments: value }))}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="verified"
                    checked={filters.verified}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: !!checked }))}
                  />
                  <label htmlFor="verified" className="text-sm">Verified users only</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasMedia"
                    checked={filters.hasMedia}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasMedia: !!checked }))}
                  />
                  <label htmlFor="hasMedia" className="text-sm">Has media</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchPerformed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Search Results</h2>
              {results.length > 0 && (
                <Badge variant="secondary">
                  {results.length} results found
                </Badge>
              )}
            </div>

            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching the cosmos...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map(renderSearchResult)}
              </div>
            ) : (
              <Card className="glass-effect">
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search filters or using different keywords
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
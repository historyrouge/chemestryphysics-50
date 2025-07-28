import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Hash, User, Calendar, TrendingUp, X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'hashtag';
  title: string;
  subtitle?: string;
  avatar?: string;
  content?: string;
  metadata?: {
    posts_count?: number;
    followers_count?: number;
    engagement?: number;
    trending?: boolean;
  };
}

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const AdvancedSearch = ({ onResultSelect, placeholder = "Search cosmos...", className }: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'post',
      title: 'Amazing shot of the Andromeda Galaxy',
      subtitle: 'Posted by Sarah Chen • 2h ago',
      content: 'Just captured this incredible view of our neighboring galaxy using my new telescope setup...',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      metadata: { engagement: 8.5, trending: true }
    },
    {
      id: '2',
      type: 'user',
      title: 'Alex Rodriguez',
      subtitle: '@alex_stargazer • NASA Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      metadata: { followers_count: 8900, posts_count: 89 }
    },
    {
      id: '3',
      type: 'hashtag',
      title: '#MarsExploration',
      subtitle: '12.5K posts • Trending',
      metadata: { posts_count: 12500, trending: true }
    },
    {
      id: '4',
      type: 'post',
      title: 'How to photograph the International Space Station',
      subtitle: 'Posted by Jake Thompson • 5h ago',
      content: 'A complete guide to tracking and photographing the ISS as it passes overhead...',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
      metadata: { engagement: 6.8 }
    },
  ];

  useEffect(() => {
    setTrendingTopics(['#MarsExploration', '#Astrophotography', '#SpaceX', '#NASAMissions', '#BlackHole']);
    setRecentSearches(['Andromeda Galaxy', 'telescope reviews', 'Mars mission']);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filteredResults = mockResults.filter(result => {
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          result.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filters.type !== 'all' && result.type !== filters.type) return false;
      
      return matchesQuery;
    });

    // Sort results
    filteredResults.sort((a, b) => {
      if (filters.sortBy === 'trending') {
        return (b.metadata?.trending ? 1 : 0) - (a.metadata?.trending ? 1 : 0);
      }
      if (filters.sortBy === 'engagement') {
        return (b.metadata?.engagement || 0) - (a.metadata?.engagement || 0);
      }
      // Default: relevance (mock relevance score)
      return 0;
    });

    setResults(filteredResults);
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    performSearch(value);
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [result.title, ...prev.filter(item => item !== result.title)];
      return updated.slice(0, 5);
    });
    
    setIsOpen(false);
    onResultSelect?.(result);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'hashtag':
        return <Hash className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 bg-background/50 border-border/50 focus:border-accent/50"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-card/95 backdrop-blur-md border-border/50">
              <div className="space-y-4">
                <h4 className="font-semibold">Search Filters</h4>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Content Type</label>
                  <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="post">Posts</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="hashtag">Hashtags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto bg-card/95 backdrop-blur-md border-border/50 shadow-glow-primary z-50">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : query ? (
              results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="p-3 hover:bg-accent/10 cursor-pointer border-b border-border/20 last:border-b-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {result.avatar ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={result.avatar} alt={result.title} />
                              <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              {getResultIcon(result.type)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{result.title}</span>
                            {result.metadata?.trending && (
                              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          
                          {result.subtitle && (
                            <p className="text-sm text-muted-foreground mb-1">{result.subtitle}</p>
                          )}
                          
                          {result.content && (
                            <p className="text-sm text-foreground line-clamp-2">{result.content}</p>
                          )}
                          
                          {result.metadata && (
                            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                              {result.metadata.followers_count && (
                                <span>{formatNumber(result.metadata.followers_count)} followers</span>
                              )}
                              {result.metadata.posts_count && (
                                <span>{formatNumber(result.metadata.posts_count)} posts</span>
                              )}
                              {result.metadata.engagement && (
                                <span>{result.metadata.engagement}% engagement</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{query}"</p>
                </div>
              )
            ) : (
              <div className="py-2">
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-border/20">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Recent Searches
                    </h4>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="p-3">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-accent/20"
                        onClick={() => handleSearch(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
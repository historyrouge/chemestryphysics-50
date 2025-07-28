import { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Users, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory] = useState([
    'nebula photography',
    'saturn rings',
    'cosmic meditation',
    'space exploration',
  ]);

  const [trendingTopics] = useState([
    { tag: '#CosmicVibes', posts: 1250 },
    { tag: '#StarGazing', posts: 892 },
    { tag: '#SpaceArt', posts: 654 },
    { tag: '#Astronomy', posts: 445 },
    { tag: '#Meditation', posts: 321 },
  ]);

  const [suggestedUsers] = useState([
    {
      id: '1',
      name: 'Luna Stardust',
      username: 'lunastardust',
      avatar: '/placeholder.svg',
      followers: 15600,
      verified: true,
    },
    {
      id: '2',
      name: 'Cosmic Explorer',
      username: 'cosmicexplorer',
      avatar: '/placeholder.svg',
      followers: 8900,
      verified: false,
    },
    {
      id: '3',
      name: 'Nebula Dreams',
      username: 'nebuladreams',
      avatar: '/placeholder.svg',
      followers: 12300,
      verified: true,
    },
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cosmic-card max-w-2xl h-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-cosmic-text flex items-center gap-2">
            <Search className="h-5 w-5" />
            Explore the Cosmos
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-4 flex-1 overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
            <Input
              placeholder="Search posts, bits, users, and hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-cosmic-secondary/30 border-cosmic-border"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {!searchQuery ? (
            <Tabs defaultValue="trending" className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  People
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-4">
                <h3 className="font-semibold text-cosmic-text mb-3">Trending Hashtags</h3>
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.tag}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-cosmic-secondary/30 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cosmic-gradient text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-cosmic-text group-hover:text-cosmic-accent transition-colors">
                          {topic.tag}
                        </p>
                        <p className="text-sm text-cosmic-muted">
                          {topic.posts.toLocaleString()} posts
                        </p>
                      </div>
                    </div>
                    <Hash className="h-4 w-4 text-cosmic-muted" />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <h3 className="font-semibold text-cosmic-text mb-3">Recent Searches</h3>
                {searchHistory.map((query) => (
                  <div
                    key={query}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-cosmic-secondary/30 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-cosmic-muted" />
                      <span className="text-cosmic-text group-hover:text-cosmic-accent transition-colors">
                        {query}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <h3 className="font-semibold text-cosmic-text mb-3">Suggested Users</h3>
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-cosmic-secondary/30 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="ring-2 ring-cosmic-accent/20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-cosmic-gradient text-white">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-cosmic-text group-hover:text-cosmic-accent transition-colors">
                            {user.name}
                          </p>
                          {user.verified && (
                            <Badge variant="secondary" className="bg-cosmic-accent/20 text-cosmic-accent">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-cosmic-muted">
                          @{user.username} • {user.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="cosmic-button">
                      Follow
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-cosmic-muted mx-auto mb-4" />
                <p className="text-cosmic-muted">Search results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
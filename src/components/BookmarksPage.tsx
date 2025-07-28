import { ArrowLeft, Bookmark, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarField from './StarField';

interface BookmarksPageProps {
  onNavigateBack: () => void;
}

const BookmarksPage = ({ onNavigateBack }: BookmarksPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const bookmarks = [
    {
      id: 1,
      type: 'post',
      content: 'Just discovered this amazing technique for photographing the Milky Way. Game changer for astrophotography!',
      author: { name: 'Night Sky Photos', username: 'nightsky_photos', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop' },
      bookmarkedAt: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      type: 'bit',
      title: 'Black Hole Simulation Explained',
      content: 'This 30-second explanation of how black holes warp spacetime is mind-blowing!',
      author: { name: 'Physics Fun', username: 'physics_fun', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b86d85ba?w=40&h=40&fit=crop' },
      bookmarkedAt: '2024-01-14',
      thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      type: 'post',
      content: 'The James Webb telescope has captured the most detailed image of the Crab Nebula yet. The level of detail is extraordinary.',
      author: { name: 'Space News Daily', username: 'spacenews', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop' },
      bookmarkedAt: '2024-01-13',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=300&fit=crop'
    },
    {
      id: 4,
      type: 'post',
      content: 'Mars opposition is coming up next month! Here are the best times and locations to observe the red planet.',
      author: { name: 'Planetary Observer', username: 'planet_observer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
      bookmarkedAt: '2024-01-12'
    }
  ];

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || bookmark.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 glass-effect border-b border-border z-20">
          <div className="flex items-center gap-4 p-4 max-w-2xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Bookmarks</h1>
              <p className="text-sm text-muted-foreground">{bookmarks.length} saved items</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border focus:border-accent"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'post' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('post')}
              >
                Posts
              </Button>
              <Button
                variant={filterType === 'bit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('bit')}
              >
                Bits
              </Button>
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="space-y-4">
            {filteredBookmarks.length === 0 ? (
              <Card className="glass-effect border-border">
                <CardContent className="p-8 text-center">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? 'Try adjusting your search terms or filters'
                      : 'Save posts and bits to find them here later'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="glass-effect border-border hover:bg-card/90 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={bookmark.author.avatar} alt={bookmark.author.name} />
                        <AvatarFallback>{bookmark.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{bookmark.author.name}</span>
                          <span className="text-muted-foreground">@{bookmark.author.username}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-muted-foreground text-sm">
                            Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                          </span>
                          <div className="ml-auto">
                            <Bookmark className="w-4 h-4 text-accent fill-current" />
                          </div>
                        </div>
                        
                        {bookmark.type === 'bit' && bookmark.title && (
                          <h3 className="font-semibold mb-2">{bookmark.title}</h3>
                        )}
                        
                        <p className="text-foreground mb-3">{bookmark.content}</p>
                        
                        {bookmark.image && (
                          <img 
                            src={bookmark.image} 
                            alt="Bookmarked content"
                            className="rounded-lg max-w-full h-auto mb-3 border border-border/50"
                          />
                        )}
                        
                        {bookmark.thumbnail && bookmark.type === 'bit' && (
                          <div className="relative inline-block">
                            <img 
                              src={bookmark.thumbnail} 
                              alt="Video thumbnail"
                              className="rounded-lg w-32 h-24 object-cover border border-border/50"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[6px] border-r-0 border-t-[4px] border-b-[4px] border-l-black border-t-transparent border-b-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                            {bookmark.type === 'bit' ? 'Bit' : 'Post'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
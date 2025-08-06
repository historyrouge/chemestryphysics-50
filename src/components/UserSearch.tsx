import { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useFollows } from '@/hooks/useFollows';
import { useMessages } from '@/hooks/useMessages';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
}

interface UserSearchProps {
  onStartChat?: (userId: string) => void;
}

const UserSearch = ({ onStartChat }: UserSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { followUser, unfollowUser, isFollowing } = useFollows(user?.id);
  const { createConversation } = useMessages(user?.id);

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
        .neq('user_id', user?.id)
        .limit(20);

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    console.log('Attempting to follow user with user_id:', userId);
    await followUser(userId);
  };

  const handleUnfollow = async (userId: string) => {
    console.log('Attempting to unfollow user with user_id:', userId);
    await unfollowUser(userId);
  };

  const handleStartChat = async (userId: string) => {
    const conversationId = await createConversation(userId);
    if (conversationId && onStartChat) {
      onStartChat(conversationId);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Searching...</p>
        </div>
      )}

      <div className="space-y-3">
        {users.map((profile) => (
          <Card key={profile.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-gradient-cosmic text-white">
                      {profile.name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{profile.name || profile.username}</h4>
                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    {profile.bio && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isFollowing(profile.user_id) ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartChat(profile.user_id)}
                        className="text-xs"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(profile.user_id)}
                        className="text-xs"
                      >
                        <UserCheck className="w-3 h-3 mr-1" />
                        Following
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleFollow(profile.user_id)}
                      className="text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchQuery && !loading && users.length === 0 && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            Try searching with different keywords or check the spelling.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
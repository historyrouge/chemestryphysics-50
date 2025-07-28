import { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Users, Crown, Star } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  verified: boolean;
  is_following: boolean;
  is_followed_by: boolean;
  engagement_score: number;
}

interface UserFollowSystemProps {
  userId?: string;
}

const UserFollowSystem = ({ userId }: UserFollowSystemProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [followers, setFollowers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockUsers: UserProfile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      username: 'sarah_cosmos',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Astrophotographer | Space enthusiast | Sharing the beauty of cosmos',
      followers_count: 12500,
      following_count: 892,
      posts_count: 156,
      verified: true,
      is_following: false,
      is_followed_by: false,
      engagement_score: 8.5,
    },
    {
      id: '2',
      name: 'Alex Rodriguez',
      username: 'alex_stargazer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      bio: 'NASA Engineer | Telescope reviews | Mars mission updates',
      followers_count: 8900,
      following_count: 445,
      posts_count: 89,
      verified: true,
      is_following: true,
      is_followed_by: true,
      engagement_score: 9.2,
    },
    {
      id: '3',
      name: 'Maya Patel',
      username: 'maya_universe',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      bio: 'Planetary scientist | Exoplanet hunter | Science communicator',
      followers_count: 6750,
      following_count: 234,
      posts_count: 234,
      verified: false,
      is_following: false,
      is_followed_by: true,
      engagement_score: 7.8,
    },
    {
      id: '4',
      name: 'Jake Thompson',
      username: 'jake_cosmos',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
      bio: 'Amateur astronomer | Time-lapse creator | Night sky photographer',
      followers_count: 3200,
      following_count: 567,
      posts_count: 78,
      verified: false,
      is_following: false,
      is_followed_by: false,
      engagement_score: 6.5,
    },
  ];

  useEffect(() => {
    setSuggestions(mockUsers.filter(u => !u.is_following));
    setFollowing(mockUsers.filter(u => u.is_following));
    setFollowers(mockUsers.filter(u => u.is_followed_by));
  }, []);

  const handleFollow = async (targetUserId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setSuggestions(prev =>
        prev.map(user =>
          user.id === targetUserId
            ? { ...user, is_following: true, followers_count: user.followers_count + 1 }
            : user
        )
      );

      setFollowing(prev => [
        ...prev,
        ...suggestions.filter(u => u.id === targetUserId).map(u => ({ ...u, is_following: true }))
      ]);

      toast({
        title: 'Following!',
        description: `You are now following ${suggestions.find(u => u.id === targetUserId)?.name}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to follow user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setFollowing(prev => prev.filter(user => user.id !== targetUserId));
      
      setSuggestions(prev =>
        prev.map(user =>
          user.id === targetUserId
            ? { ...user, is_following: false, followers_count: Math.max(0, user.followers_count - 1) }
            : user
        )
      );

      toast({
        title: 'Unfollowed',
        description: 'User unfollowed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unfollow user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getEngagementBadge = (score: number) => {
    if (score >= 9) return { text: 'Top Creator', color: 'bg-purple-500/20 text-purple-300' };
    if (score >= 8) return { text: 'Active', color: 'bg-green-500/20 text-green-300' };
    if (score >= 7) return { text: 'Engaging', color: 'bg-blue-500/20 text-blue-300' };
    return { text: 'Growing', color: 'bg-yellow-500/20 text-yellow-300' };
  };

  const UserCard = ({ user: userProfile, showFollowButton = true }: { user: UserProfile; showFollowButton?: boolean }) => {
    const engagementBadge = getEngagementBadge(userProfile.engagement_score);

    return (
      <Card className="bg-card/80 backdrop-blur-md border-border/50 hover:border-accent/30 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-accent/20">
              <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
              <AvatarFallback className="bg-accent/20">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold hover:text-accent cursor-pointer">
                  {userProfile.name}
                </span>
                {userProfile.verified && (
                  <Crown className="w-4 h-4 text-yellow-500" fill="currentColor" />
                )}
                <Badge className={engagementBadge.color}>
                  <Star className="w-3 h-3 mr-1" />
                  {engagementBadge.text}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-1">@{userProfile.username}</p>
              
              {userProfile.bio && (
                <p className="text-sm text-foreground mb-3 line-clamp-2">
                  {userProfile.bio}
                </p>
              )}
              
              <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                <span><strong>{formatNumber(userProfile.followers_count)}</strong> followers</span>
                <span><strong>{formatNumber(userProfile.following_count)}</strong> following</span>
                <span><strong>{userProfile.posts_count}</strong> posts</span>
              </div>
              
              {showFollowButton && (
                <Button
                  onClick={() => userProfile.is_following ? handleUnfollow(userProfile.id) : handleFollow(userProfile.id)}
                  disabled={loading}
                  size="sm"
                  variant={userProfile.is_following ? "outline" : "default"}
                  className="w-full"
                >
                  {userProfile.is_following ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Suggested Users */}
      <Card className="bg-card/80 backdrop-blur-md border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Suggested for you
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestions.slice(0, 3).map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </CardContent>
      </Card>

      {/* Following */}
      {following.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Following ({following.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {following.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Followers */}
      {followers.length > 0 && (
        <Card className="bg-card/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Followers ({followers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {followers.map((user) => (
              <UserCard key={user.id} user={user} showFollowButton={false} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserFollowSystem;
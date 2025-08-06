import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profiles?: {
    username: string;
    name: string;
    avatar_url: string;
  };
}

export const useFollows = (userId?: string) => {
  const [follows, setFollows] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFollows = async () => {
    if (!userId) return;

    try {
      // Get users this user is following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', userId);

      if (followingError) throw followingError;

      // Get users following this user
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select('*')
        .eq('following_id', userId);

      if (followersError) throw followersError;

      setFollows(followingData || []);
      setFollowers(followersData || []);
    } catch (error) {
      console.error('Error fetching follows:', error);
      toast({
        title: "Error",
        description: "Failed to load follows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (targetUserId: string) => {
    if (!userId) return false;

    console.log('followUser called with:', { 
      currentUserId: userId, 
      targetUserId: targetUserId 
    });

    try {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: userId,
          following_id: targetUserId
        });

      if (error) {
        console.error('Supabase follow error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "User followed successfully",
      });

      fetchFollows();
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
      return false;
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userId)
        .eq('following_id', targetUserId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User unfollowed successfully",
      });

      fetchFollows();
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Error",
        description: "Failed to unfollow user",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFollowing = (targetUserId: string) => {
    return follows.some(follow => follow.following_id === targetUserId);
  };

  useEffect(() => {
    fetchFollows();
  }, [userId]);

  return {
    follows,
    followers,
    loading,
    followUser,
    unfollowUser,
    isFollowing,
    refetch: fetchFollows
  };
};
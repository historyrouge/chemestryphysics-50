import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Post = Tables<'posts'>;
type Profile = Tables<'profiles'>;

interface PostWithProfile extends Post {
  profiles: Profile;
  is_liked?: boolean;
}

interface PostsState {
  posts: PostWithProfile[];
  loading: boolean;
  hasMore: boolean;
}

interface PostsActions {
  createPost: (content: string, imageUrl?: string) => Promise<{ success: boolean; error?: string }>;
  toggleLike: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<{ success: boolean; error?: string }>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const POSTS_PER_PAGE = 10;

export const useSupabasePosts = (userId?: string): PostsState & PostsActions => {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;

      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + POSTS_PER_PAGE - 1);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load posts',
          variant: 'destructive',
        });
        return;
      }

      const postsWithExtras = await Promise.all(
        (data || []).map(async (post) => {
          // Fetch author profile - create default profile if not found
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', post.user_id)
            .single();

          const defaultProfile = {
            id: post.user_id,
            user_id: post.user_id,
            username: 'guest_user',
            name: 'Guest User',
            bio: null,
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          return {
            ...post,
            profiles: profile || defaultProfile,
            is_liked: false, // Public mode - no personal likes tracked
          };
        })
      );

      if (reset) {
        setPosts(postsWithExtras);
        setOffset(POSTS_PER_PAGE);
      } else {
        setPosts(prev => [...prev, ...postsWithExtras]);
        setOffset(prev => prev + POSTS_PER_PAGE);
      }

      setHasMore(postsWithExtras.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [offset, userId, toast]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const createPost = async (content: string, imageUrl?: string): Promise<{ success: boolean; error?: string }> => {
    // For demo purposes, we'll create a guest post
    const guestUserId = 'guest-user-' + Date.now();

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          image_url: imageUrl,
          user_id: guestUserId,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      // Refresh posts to show the new one
      await refresh();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const toggleLike = async (postId: string): Promise<void> => {
    // In public mode, just show visual feedback without persisting
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          is_liked: !post.is_liked,
        };
      }
      return post;
    }));
  };

  const deletePost = async (postId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'Success',
        description: 'Post deleted successfully!',
      });

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const loadMore = async (): Promise<void> => {
    if (!hasMore || loading) return;
    await fetchPosts(false);
  };

  const refresh = async (): Promise<void> => {
    setOffset(0);
    await fetchPosts(true);
  };

  return {
    posts,
    loading,
    hasMore,
    createPost,
    toggleLike,
    deletePost,
    loadMore,
    refresh,
  };
};
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
          // Fetch author profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', post.user_id)
            .single();

          let isLiked = false;

          if (userId) {
            // Check if user liked this post
            const { data: likeData } = await supabase
              .from('likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', userId)
              .single();

            isLiked = !!likeData;
          }

          return {
            ...post,
            profiles: profile,
            is_liked: isLiked,
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
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the new post with profile data
            fetchNewPost(payload.new.id);
          } else if (payload.eventType === 'DELETE') {
            setPosts(prev => prev.filter(post => post.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setPosts(prev => prev.map(post => 
              post.id === payload.new.id 
                ? { ...post, ...payload.new } 
                : post
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNewPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error || !data) return;

      // Fetch author profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user_id)
        .single();

      let isLiked = false;

      if (userId) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('post_id', data.id)
          .eq('user_id', userId)
          .single();

        isLiked = !!likeData;
      }

      const newPost = {
        ...data,
        profiles: profile,
        is_liked: isLiked,
      };

      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Error fetching new post:', error);
    }
  };

  const createPost = async (content: string, imageUrl?: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          image_url: imageUrl,
          user_id: userId,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'Success',
        description: 'Post created successfully!',
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const toggleLike = async (postId: string): Promise<void> => {
    if (!userId) return;

    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        // Update local state
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: false,
            };
          }
          return post;
        }));
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: userId });

        // Update local state
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: true,
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const deletePost = async (postId: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'Success',
        description: 'Post deleted successfully!',
      });

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
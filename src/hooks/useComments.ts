import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Comment = Tables<'comments'>;
type Profile = Tables<'profiles'>;

interface CommentWithProfile extends Comment {
  profiles: Profile;
  replies?: CommentWithProfile[];
  is_liked?: boolean;
  reply_count?: number;
}

interface CommentsState {
  comments: CommentWithProfile[];
  loading: boolean;
  hasMore: boolean;
}

interface CommentsActions {
  addComment: (content: string, parentId?: string) => Promise<{ success: boolean; error?: string }>;
  toggleLike: (commentId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<{ success: boolean; error?: string }>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

const COMMENTS_PER_PAGE = 20;

export const useComments = (
  postId?: string,
  storyId?: string,
  userId?: string
): CommentsState & CommentsActions => {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  const fetchComments = useCallback(async (reset = false) => {
    if (!postId && !storyId) return;

    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;

      let query = supabase
        .from('comments')
        .select('*')
        .is('parent_id', null) // Only fetch top-level comments first
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + COMMENTS_PER_PAGE - 1);

      if (postId) {
        query = query.eq('post_id', postId);
      } else if (storyId) {
        query = query.eq('story_id', storyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load comments',
          variant: 'destructive',
        });
        return;
      }

      // Fetch profiles and replies for each comment
      const commentsWithExtras = await Promise.all(
        (data || []).map(async (comment) => {
          // Fetch author profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', comment.user_id)
            .single();

          // Fetch replies
          const { data: replies } = await supabase
            .from('comments')
            .select('*')
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          // Check if user liked this comment
          let isLiked = false;
          if (userId) {
            const { data: likeData } = await supabase
              .from('comment_likes')
              .select('id')
              .eq('comment_id', comment.id)
              .eq('user_id', userId)
              .single();

            isLiked = !!likeData;
          }

          // Add profile and like status to replies as well
          const repliesWithExtras = await Promise.all(
            (replies || []).map(async (reply) => {
              // Fetch reply author profile
              const { data: replyProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', reply.user_id)
                .single();

              let replyIsLiked = false;
              if (userId) {
                const { data: replyLikeData } = await supabase
                  .from('comment_likes')
                  .select('id')
                  .eq('comment_id', reply.id)
                  .eq('user_id', userId)
                  .single();

                replyIsLiked = !!replyLikeData;
              }

              return {
                ...reply,
                profiles: replyProfile,
                is_liked: replyIsLiked,
              };
            })
          );

          return {
            ...comment,
            profiles: profile,
            replies: repliesWithExtras,
            is_liked: isLiked,
            reply_count: (replies || []).length,
          };
        })
      );

      if (reset) {
        setComments(commentsWithExtras);
        setOffset(COMMENTS_PER_PAGE);
      } else {
        setComments(prev => [...prev, ...commentsWithExtras]);
        setOffset(prev => prev + COMMENTS_PER_PAGE);
      }

      setHasMore(commentsWithExtras.length === COMMENTS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [offset, postId, storyId, userId, toast]);

  useEffect(() => {
    if (postId || storyId) {
      fetchComments(true);
    }
  }, [postId, storyId, userId]);

  // Set up real-time subscription for comments
  useEffect(() => {
    if (!postId && !storyId) return;

    const channel = supabase
      .channel('comments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: postId ? `post_id=eq.${postId}` : `story_id=eq.${storyId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            fetchNewComment(payload.new.id);
          } else if (payload.eventType === 'DELETE') {
            setComments(prev => removeCommentFromTree(prev, payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setComments(prev => updateCommentInTree(prev, payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, storyId]);

  const removeCommentFromTree = (comments: CommentWithProfile[], commentId: string): CommentWithProfile[] => {
    return comments
      .filter(comment => comment.id !== commentId)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? removeCommentFromTree(comment.replies, commentId) : undefined,
      }));
  };

  const updateCommentInTree = (comments: CommentWithProfile[], updatedComment: any): CommentWithProfile[] => {
    return comments.map(comment => {
      if (comment.id === updatedComment.id) {
        return { ...comment, ...updatedComment };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, updatedComment),
        };
      }
      return comment;
    });
  };

  const fetchNewComment = async (commentId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('id', commentId)
        .single();

      if (error || !data) return;

      // Fetch author profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user_id)
        .single();

      let isLiked = false;
      if (userId) {
        const { data: likeData } = await supabase
          .from('comment_likes')
          .select('id')
          .eq('comment_id', data.id)
          .eq('user_id', userId)
          .single();

        isLiked = !!likeData;
      }

      const newComment = {
        ...data,
        profiles: profile,
        replies: [],
        is_liked: isLiked,
        reply_count: 0,
      };

      if (data.parent_id) {
        // This is a reply, add it to the parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === data.parent_id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
              reply_count: (comment.reply_count || 0) + 1,
            };
          }
          return comment;
        }));
      } else {
        // This is a top-level comment
        setComments(prev => [newComment, ...prev]);
      }
    } catch (error) {
      console.error('Error fetching new comment:', error);
    }
  };

  const addComment = async (content: string, parentId?: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!postId && !storyId) {
      return { success: false, error: 'No post or story specified' };
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          user_id: userId,
          post_id: postId || null,
          story_id: storyId || null,
          parent_id: parentId || null,
          likes: 0,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Update comment count on the post or story
      if (postId) {
        const { data: post } = await supabase
          .from('posts')
          .select('comments')
          .eq('id', postId)
          .single();

        if (post) {
          await supabase
            .from('posts')
            .update({ comments: (post.comments || 0) + 1 })
            .eq('id', postId);
        }
      }

      toast({
        title: 'Success',
        description: 'Comment added successfully!',
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const toggleLike = async (commentId: string): Promise<void> => {
    if (!userId) return;

    try {
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId);

        // Update local state
        setComments(prev => updateCommentLikes(prev, commentId, false));

        // Update comment likes count
        const comment = findCommentInTree(comments, commentId);
        if (comment) {
          await supabase
            .from('comments')
            .update({ likes: Math.max(0, (comment.likes || 0) - 1) })
            .eq('id', commentId);
        }
      } else {
        // Like
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: userId });

        // Update local state
        setComments(prev => updateCommentLikes(prev, commentId, true));

        // Update comment likes count
        const comment = findCommentInTree(comments, commentId);
        if (comment) {
          await supabase
            .from('comments')
            .update({ likes: (comment.likes || 0) + 1 })
            .eq('id', commentId);
        }
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const findCommentInTree = (comments: CommentWithProfile[], commentId: string): CommentWithProfile | null => {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.replies) {
        const found = findCommentInTree(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  };

  const updateCommentLikes = (comments: CommentWithProfile[], commentId: string, isLiked: boolean): CommentWithProfile[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: isLiked ? (comment.likes || 0) + 1 : Math.max(0, (comment.likes || 0) - 1),
          is_liked: isLiked,
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentLikes(comment.replies, commentId, isLiked),
        };
      }
      return comment;
    });
  };

  const deleteComment = async (commentId: string): Promise<{ success: boolean; error?: string }> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: 'Success',
        description: 'Comment deleted successfully!',
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const loadMore = async (): Promise<void> => {
    if (!hasMore || loading) return;
    await fetchComments(false);
  };

  const refresh = async (): Promise<void> => {
    setOffset(0);
    await fetchComments(true);
  };

  return {
    comments,
    loading,
    hasMore,
    addComment,
    toggleLike,
    deleteComment,
    loadMore,
    refresh,
  };
};
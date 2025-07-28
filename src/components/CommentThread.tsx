import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Reply, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useComments } from '@/hooks/useComments';
import { useUser } from '@/contexts/UserContext';
import { formatDistanceToNow } from 'date-fns';

interface CommentWithProfile {
  id: string;
  content: string;
  created_at: string;
  likes: number | null;
  user_id: string;
  parent_id: string | null;
  post_id: string | null;
  story_id: string | null;
  profiles: {
    id: string;
    username: string;
    name: string;
    avatar_url: string | null;
  };
  replies?: CommentWithProfile[];
  is_liked?: boolean;
  reply_count?: number;
}

interface CommentItemProps {
  comment: CommentWithProfile;
  onReply: (parentId: string) => void;
  onToggleLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
  depth?: number;
}

const CommentItem = ({ comment, onReply, onToggleLike, onDelete, currentUserId, depth = 0 }: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(true);
  const isOwner = currentUserId === comment.user_id;
  const maxDepth = 3;

  return (
    <div className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-border' : ''}`}>
      <div className="flex space-x-3 py-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.profiles.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-cosmic text-white text-xs">
            {comment.profiles.name?.charAt(0) || comment.profiles.username?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-accent text-sm">
              {comment.profiles.name || comment.profiles.username}
            </span>
            <span className="text-xs text-muted-foreground">
              @{comment.profiles.username}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className="text-sm mt-1 text-foreground break-words">
            {comment.content}
          </p>

          <div className="flex items-center space-x-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleLike(comment.id)}
              className={`h-8 px-2 ${comment.is_liked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
            >
              <Heart className={`w-4 h-4 ${comment.is_liked ? 'fill-current' : ''}`} />
              {(comment.likes || 0) > 0 && (
                <span className="ml-1 text-xs">{comment.likes}</span>
              )}
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReply(comment.id)}
                className="h-8 px-2 text-muted-foreground hover:text-accent"
              >
                <Reply className="w-4 h-4" />
                <span className="ml-1 text-xs">Reply</span>
              </Button>
            )}

            {(comment.replies && comment.replies.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="h-8 px-2 text-muted-foreground hover:text-accent"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="ml-1 text-xs">
                  {comment.reply_count || comment.replies.length} {(comment.reply_count || comment.replies.length) === 1 ? 'reply' : 'replies'}
                </span>
              </Button>
            )}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-accent"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && showReplies && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onToggleLike={onToggleLike}
              onDelete={onDelete}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentThreadProps {
  postId?: string;
  storyId?: string;
  className?: string;
}

const CommentThread = ({ postId, storyId, className = '' }: CommentThreadProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const { user } = useUser();

  const {
    comments,
    loading,
    hasMore,
    addComment,
    toggleLike,
    deleteComment,
    loadMore,
  } = useComments(postId, storyId, user?.id);

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) return;

    const result = await addComment(newCommentContent);
    if (result.success) {
      setNewCommentContent('');
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    const result = await addComment(replyContent, parentId);
    if (result.success) {
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };

  if (!user) {
    return (
      <div className={`p-4 text-center text-muted-foreground ${className}`}>
        Please log in to view and add comments
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Add Comment */}
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-gradient-cosmic text-white text-xs">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] resize-none"
            maxLength={300}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {newCommentContent.length}/300
            </span>
            <Button
              onClick={handleAddComment}
              disabled={!newCommentContent.trim()}
              size="sm"
              variant="cosmic"
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              onReply={(parentId) => setReplyingTo(parentId)}
              onToggleLike={toggleLike}
              onDelete={handleDelete}
              currentUserId={user.id}
            />

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="ml-11 mt-2 flex space-x-3">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-cosmic text-white text-xs">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[60px] resize-none text-sm"
                    maxLength={300}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {replyContent.length}/300
                    </span>
                    <div className="space-x-2">
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyContent.trim()}
                        size="sm"
                        variant="cosmic"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="ghost"
            size="sm"
          >
            {loading ? 'Loading...' : 'Load more comments'}
          </Button>
        </div>
      )}

      {comments.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentThread;
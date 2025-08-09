import { useState } from 'react';
import { X, Send, Smile, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface PostReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const PostReplyModal = ({ isOpen, onClose, post }: PostReplyModalProps) => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !user || !post) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: replyText.trim(),
          post_id: post.id,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Reply posted!",
        description: "Your reply has been posted successfully.",
      });

      setReplyText('');
      onClose();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-effect border-accent/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-accent/10 pb-4">
          <DialogTitle className="flex items-center gap-2 text-accent">
            <Reply className="w-5 h-5" />
            Reply to Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Original Post */}
          <div className="bg-muted/20 rounded-xl p-4 border border-accent/10">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-accent/20">
                <AvatarImage src={post.profiles?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-cosmic text-white">
                  {post.profiles?.name?.charAt(0) || post.profiles?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-accent">
                    {post.profiles?.name || post.profiles?.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    @{post.profiles?.username}
                  </span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
                {post.image_url && (
                  <div className="mt-3">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full rounded-lg max-h-64 object-cover border border-accent/20"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reply Section */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-accent/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-cosmic text-white">
                  {profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Replying to <span className="text-accent">@{post.profiles?.username}</span>
                </p>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Write your reply..."
                  className="min-h-[120px] bg-input/50 border-accent/20 focus:border-accent resize-none"
                  maxLength={280}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-accent p-2"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {replyText.length}/280
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim() || isSubmitting}
                      variant="cosmic"
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Reply
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Tip: Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Cmd</kbd> + <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Enter</kbd> to post quickly
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostReplyModal;
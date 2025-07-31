import { useState } from 'react';
import { X, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useSocialStore } from '@/stores/socialStore';

interface StoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoryUploadModal = ({ isOpen, onClose }: StoryUploadModalProps) => {
  const { user, profile } = useUser();
  const { addStory } = useSocialStore();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    try {
      // Add story to local store (mock data for now)
      addStory({
        title: title.trim(),
        content: undefined,
        mediaUrl: '/placeholder.svg',
        author: {
          name: profile?.name || profile?.username || 'User',
          avatar: profile?.avatar_url || '/placeholder.svg',
          username: profile?.username || 'user',
        },
        views: 0,
        isOwn: true,
      });

      // Reset form
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="glass-effect w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              Create Story
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Story Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your story title..."
                maxLength={100}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Stories disappear after 24 hours
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="flex-1"
                variant="cosmic"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Upload Story'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryUploadModal;
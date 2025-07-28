import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Smile, MapPin, Users, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { createPost, profile } = useUser();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag();
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    // In a real app, you would upload to a service like Supabase Storage, AWS S3, etc.
    // For now, we'll create a placeholder URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/uploads/${Date.now()}-${file.name}`);
      }, 1000);
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter some content for your post',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage) || undefined;
      }

      // Add tags to content
      const contentWithTags = tags.length > 0 
        ? `${content}\n\n${tags.map(tag => `#${tag}`).join(' ')}`
        : content;

      const result = await createPost(contentWithTags, imageUrl);

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Your post has been created successfully',
        });
        handleClose();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create post',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedImage(null);
    setImagePreview(null);
    setTags([]);
    setCurrentTag('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-accent">Create Post</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-cosmic text-white">
                {profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-accent">
                {profile?.name || profile?.username || 'User'}
              </p>
              <p className="text-sm text-muted-foreground">
                @{profile?.username || 'user'}
              </p>
            </div>
          </div>

          {/* Text Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[120px] border-0 resize-none text-lg bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            maxLength={500}
          />

          {/* Character Count */}
          <div className="flex justify-end">
            <span className={`text-sm ${content.length > 450 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {content.length}/500
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-accent/10 text-accent hover:bg-accent/20"
                >
                  #{tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-accent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Add tags (press Enter)"
              className="flex-1 bg-transparent border-0 outline-0 text-sm placeholder-muted-foreground"
              maxLength={20}
            />
            {currentTag && (
              <Button
                variant="ghost"
                size="sm"
                onClick={addTag}
                className="text-accent hover:text-accent/80"
              >
                Add
              </Button>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-80 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            {/* Media Options */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-accent hover:text-accent/80"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent/80"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent/80"
              >
                <MapPin className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent/80"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent/80"
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              variant="cosmic"
              className="px-6"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CreatePostModal;
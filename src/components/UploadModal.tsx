import { useState, useRef } from 'react';
import { X, Upload, Video, Image as ImageIcon, Tag } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'bit';
}

const UploadModal = ({ isOpen, onClose, type }: UploadModalProps) => {
  const { createPost } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    content: '',
    title: '',
    description: '',
    tags: '',
    file: null as File | null
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (type === 'bit' && !isVideo) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a video file for bits.',
        variant: 'destructive'
      });
      return;
    }

    if (type === 'post' && !isImage && !isVideo) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image or video file.',
        variant: 'destructive'
      });
      return;
    }

    // Check video duration for bits (max 60 seconds)
    if (type === 'bit' && isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          toast({
            title: 'Video too long',
            description: 'Bits must be 60 seconds or less.',
            variant: 'destructive'
          });
          return;
        }
        setFormData(prev => ({ ...prev, file }));
        setPreview(URL.createObjectURL(file));
      };
      video.src = URL.createObjectURL(file);
    } else {
      setFormData(prev => ({ ...prev, file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (type === 'post') {
        if (!formData.content.trim()) {
          toast({
            title: 'Content required',
            description: 'Please enter some content for your post.',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
        
        const result = await createPost(formData.content, preview || undefined);
        if (result.success) {
          toast({
            title: 'Post created!',
            description: 'Your post has been shared with the cosmic community.',
          });
        } else {
          toast({
            title: 'Failed to create post',
            description: result.error || 'Something went wrong',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
      } else {
        // For now, just show a message that bits aren't implemented yet
        toast({
          title: 'Coming soon!',
          description: 'Bits feature is not yet implemented.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Reset form
      setFormData({
        content: '',
        title: '',
        description: '',
        tags: '',
        file: null
      });
      setPreview(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 backdrop-blur-md rounded-xl border border-border/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-xl font-bold">
            {type === 'post' ? 'Create Post' : 'Upload Bit'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {type === 'post' ? 'Media (optional)' : 'Video File *'}
            </Label>
            <div 
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  {formData.file?.type.startsWith('video/') ? (
                    <video 
                      src={preview} 
                      className="max-w-full h-auto max-h-60 mx-auto rounded-lg"
                      controls
                    />
                  ) : (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-w-full h-auto max-h-60 mx-auto rounded-lg"
                    />
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setFormData(prev => ({ ...prev, file: null }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {type === 'bit' ? (
                      <Video className="w-12 h-12 text-muted-foreground" />
                    ) : (
                      <div className="flex gap-2">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        <Video className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {type === 'bit' ? 'Upload your video' : 'Add media to your post'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {type === 'bit' 
                        ? 'Videos must be 60 seconds or less' 
                        : 'Drag and drop or click to browse'
                      }
                    </p>
                  </div>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={type === 'bit' ? 'video/*' : 'image/*,video/*'}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Post Content or Bit Title */}
          {type === 'post' ? (
            <div>
              <Label htmlFor="content" className="text-sm font-medium mb-2 block">
                What's on your mind? *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your cosmic thoughts..."
                className="bg-background/50 min-h-[120px]"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your bit a catchy title..."
                  className="bg-background/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your bit..."
                  className="bg-background/50"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-sm font-medium mb-2 block">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="cosmic, space, astronomy (separate with commas)"
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Separate tags with commas
                </p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 cosmic-btn"
            >
              {loading ? 'Uploading...' : (type === 'post' ? 'Post' : 'Upload Bit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
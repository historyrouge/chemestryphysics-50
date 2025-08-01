import { useState } from 'react';
import { Upload, X, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BitUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback to refresh data
}

const BitUploadModal = ({ isOpen, onClose, onSuccess }: BitUploadModalProps) => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: ''
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (video only)
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size should be less than 100MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title.trim()) return;

    setIsLoading(true);

    try {
      // For demo purposes, we'll create a bit entry with the blob URL
      // In a real app, you would upload the file to storage first
      const videoUrl = previewUrl; // Using blob URL for demo
      
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create a guest user ID for demo
      const guestUserId = 'guest-user-' + Date.now();

      // Save to database
      const { error } = await supabase
        .from('bits' as any)
        .insert({
          title: formData.title,
          description: formData.description || null,
          video_url: videoUrl,
          user_id: guestUserId,
          category: formData.category || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
        });

      if (error) {
        console.error('Error saving bit:', error);
        toast({
          title: 'Error',
          description: 'Failed to upload bit to database',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Bit uploaded successfully!',
      });

      // Reset form
      setFormData({ title: '', description: '', tags: '', category: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      
      // Call success callback to refresh data
      if (onSuccess) onSuccess();
      
      onClose();
    } catch (error) {
      console.error('Error uploading bit:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload bit',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="glass-effect w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Upload Bit</CardTitle>
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
          {/* File Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Video File *</label>
            {!selectedFile ? (
              <div className="border-2 border-dashed border-accent/30 rounded-lg p-8 text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-accent" />
                <p className="text-muted-foreground mb-4">
                  Drop your video here or click to browse
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    Select Video
                  </label>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your bit a catchy title"
                maxLength={100}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your bit..."
                maxLength={500}
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Space, Science, Education"
                maxLength={50}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
              />
              <div className="flex flex-wrap gap-2">
                {['space', 'astronomy', 'cosmic', 'stars', 'planets'].map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/20"
                    onClick={() => addTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit Button */}
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
                disabled={!selectedFile || !formData.title.trim() || isLoading}
                className="flex-1"
                variant="cosmic"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload Bit'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitUploadModal;
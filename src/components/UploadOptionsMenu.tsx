import { useState } from 'react';
import { Upload, Video, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UploadOptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (type: 'post' | 'bit' | 'story') => void;
}

const UploadOptionsMenu = ({ isOpen, onClose, onSelectOption }: UploadOptionsMenuProps) => {
  if (!isOpen) return null;

  const options = [
    {
      type: 'bit' as const,
      label: 'Upload Bits',
      description: 'Share short videos',
      icon: Video,
      color: 'text-purple-400'
    },
    {
      type: 'post' as const,
      label: 'Upload Post',
      description: 'Share thoughts and images',
      icon: Upload,
      color: 'text-blue-400'
    },
    {
      type: 'story' as const,
      label: 'Upload Stories',
      description: 'Share moments that disappear',
      icon: BookOpen,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="glass-effect w-full max-w-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Upload Content</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {options.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.type}
                  variant="ghost"
                  className="w-full h-auto p-4 justify-start hover:bg-accent/10"
                  onClick={() => {
                    onSelectOption(option.type);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${option.color} flex-shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadOptionsMenu;
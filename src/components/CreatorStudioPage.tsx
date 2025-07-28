import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Upload, 
  Edit3, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  Video,
  Image as ImageIcon,
  Mic,
  Settings,
  Palette,
  Layers,
  Sparkles,
  Wand2,
  Download,
  Save
} from "lucide-react";

const CreatorStudioPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const contentTemplates = [
    {
      id: '1',
      title: 'Social Media Post',
      description: 'Eye-catching post for Instagram, Twitter, or LinkedIn',
      thumbnail: '/placeholder.svg',
      category: 'Social',
      tags: ['Instagram', 'Twitter', 'LinkedIn']
    },
    {
      id: '2',
      title: 'Video Thumbnail',
      description: 'Compelling thumbnail design for YouTube videos',
      thumbnail: '/placeholder.svg',
      category: 'Video',
      tags: ['YouTube', 'Thumbnail', 'Design']
    },
    {
      id: '3',
      title: 'Story Template',
      description: 'Animated story template for social platforms',
      thumbnail: '/placeholder.svg',
      category: 'Stories',
      tags: ['Stories', 'Animation', 'Template']
    },
    {
      id: '4',
      title: 'Podcast Cover',
      description: 'Professional podcast episode cover design',
      thumbnail: '/placeholder.svg',
      category: 'Audio',
      tags: ['Podcast', 'Cover', 'Audio']
    }
  ];

  const aiTools = [
    {
      id: '1',
      name: 'Smart Caption Generator',
      description: 'Generate engaging captions for your content',
      icon: Edit3,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Hashtag Optimizer',
      description: 'Find the best hashtags for maximum reach',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Content Scheduler',
      description: 'Optimize posting times for better engagement',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Trend Analyzer',
      description: 'Analyze trending topics in your niche',
      icon: Sparkles,
      color: 'bg-orange-500'
    }
  ];

  const recentProjects = [
    {
      id: '1',
      title: 'Summer Campaign Video',
      type: 'video',
      status: 'published',
      views: '12.5K',
      engagement: 89,
      lastEdited: '2 hours ago'
    },
    {
      id: '2',
      title: 'Product Launch Post',
      type: 'image',
      status: 'draft',
      views: '0',
      engagement: 0,
      lastEdited: '1 day ago'
    },
    {
      id: '3',
      title: 'Podcast Episode 15',
      type: 'audio',
      status: 'processing',
      views: '8.2K',
      engagement: 92,
      lastEdited: '3 hours ago'
    }
  ];

  const contentMetrics = {
    totalViews: '156.8K',
    totalEngagement: '23.4K',
    totalFollowers: '89.2K',
    contentCreated: 247
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'image': return ImageIcon;
      case 'audio': return Mic;
      default: return ImageIcon;
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Creator Studio
          </h1>
          <p className="text-muted-foreground">Professional content creation tools with AI assistance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{contentMetrics.totalViews}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{contentMetrics.totalEngagement}</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{contentMetrics.totalFollowers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{contentMetrics.contentCreated}</div>
              <div className="text-sm text-muted-foreground">Content Created</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 backdrop-blur-xl">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Content Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contentTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedTemplate === template.id 
                              ? 'ring-2 ring-primary bg-primary/10' 
                              : 'bg-background/50 hover:bg-background/70'
                          }`}
                        >
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                            <Palette className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-1">{template.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                          <div className="flex gap-1">
                            {template.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <Upload className="h-6 w-6 mb-2" />
                        Upload Media
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Video className="h-6 w-6 mb-2" />
                        Record Video
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Mic className="h-6 w-6 mb-2" />
                        Record Audio
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <Wand2 className="h-6 w-6 mb-2" />
                        AI Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Project Name</label>
                      <Input placeholder="Enter project name..." className="mt-1" />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Project description..." className="mt-1" rows={3} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quality Settings</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">HD Quality</span>
                          <Switch />
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm">Compression Level</span>
                          <Slider defaultValue={[75]} max={100} step={1} />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-primary to-accent">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                  <CardHeader>
                    <CardTitle>Recent Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {['summer-video.mp4', 'logo-design.svg', 'background-music.mp3'].map((asset, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                            <span className="text-sm truncate">{asset}</span>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => {
                    const TypeIcon = getTypeIcon(project.type);
                    return (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                            <TypeIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                                {project.status}
                              </Badge>
                              <span>•</span>
                              <span>{project.lastEdited}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{project.views}</div>
                            <div className="text-muted-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{project.engagement}%</div>
                            <div className="text-muted-foreground">Engagement</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card key={tool.id} className="border-0 bg-card/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                          <p className="text-muted-foreground mb-4">{tool.description}</p>
                          <Button className="w-full bg-gradient-to-r from-primary to-accent">
                            Try Tool
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Video Content</span>
                      <span className="font-semibold">78% of total views</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Image Content</span>
                      <span className="font-semibold">15% of total views</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span>Audio Content</span>
                      <span className="font-semibold">7% of total views</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Likes</span>
                      </div>
                      <span className="font-semibold">12.8K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span>Comments</span>
                      </div>
                      <span className="font-semibold">3.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Share className="h-4 w-4 text-green-500" />
                        <span>Shares</span>
                      </div>
                      <span className="font-semibold">1.4K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>New Followers</span>
                      </div>
                      <span className="font-semibold">856</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorStudioPage;
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MessageSquare, 
  FileText, 
  Folder,
  Star,
  Filter,
  Share,
  Settings,
  Video,
  Mic,
  MonitorSpeaker,
  Coffee
} from "lucide-react";

const CollaborationPage = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const projects = [
    {
      id: '1',
      title: 'Mobile App Redesign',
      description: 'Complete UI/UX overhaul for our flagship mobile application',
      progress: 68,
      status: 'active',
      priority: 'high',
      dueDate: '2024-02-15',
      team: [
        { name: 'Sarah Chen', role: 'Designer', avatar: '/placeholder.svg' },
        { name: 'Alex Kim', role: 'Developer', avatar: '/placeholder.svg' },
        { name: 'Emma Watson', role: 'PM', avatar: '/placeholder.svg' }
      ],
      tags: ['Design', 'Mobile', 'UI/UX'],
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      title: 'AI Integration Project',
      description: 'Implementing machine learning capabilities into the platform',
      progress: 34,
      status: 'active',
      priority: 'medium',
      dueDate: '2024-03-01',
      team: [
        { name: 'David Chen', role: 'AI Engineer', avatar: '/placeholder.svg' },
        { name: 'Lisa Park', role: 'Data Scientist', avatar: '/placeholder.svg' }
      ],
      tags: ['AI', 'Machine Learning', 'Backend'],
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      title: 'Content Management System',
      description: 'Building a comprehensive CMS for content creators',
      progress: 89,
      status: 'review',
      priority: 'high',
      dueDate: '2024-01-30',
      team: [
        { name: 'John Doe', role: 'Frontend', avatar: '/placeholder.svg' },
        { name: 'Jane Smith', role: 'Backend', avatar: '/placeholder.svg' },
        { name: 'Mike Wilson', role: 'QA', avatar: '/placeholder.svg' }
      ],
      tags: ['CMS', 'Frontend', 'Content'],
      lastActivity: '30 minutes ago'
    }
  ];

  const meetings = [
    {
      id: '1',
      title: 'Daily Standup',
      time: '9:00 AM',
      duration: '30 min',
      participants: 8,
      type: 'recurring',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Design Review Session',
      time: '2:00 PM',
      duration: '1 hour',
      participants: 5,
      type: 'meeting',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Sprint Planning',
      time: '4:00 PM',
      duration: '2 hours',
      participants: 12,
      type: 'planning',
      status: 'upcoming'
    }
  ];

  const tasks = [
    {
      id: '1',
      title: 'Update user authentication flow',
      assignee: 'Alex Kim',
      priority: 'high',
      status: 'in-progress',
      dueDate: 'Today'
    },
    {
      id: '2',
      title: 'Create onboarding wireframes',
      assignee: 'Sarah Chen',
      priority: 'medium',
      status: 'todo',
      dueDate: 'Tomorrow'
    },
    {
      id: '3',
      title: 'Code review for payment integration',
      assignee: 'Emma Watson',
      priority: 'high',
      status: 'review',
      dueDate: 'Today'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'review': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Collaboration Hub
            </h1>
            <p className="text-muted-foreground mt-2">Manage projects, teams, and workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Start Meeting
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 backdrop-blur-xl">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 bg-card/60 backdrop-blur-xl border-0"
                />
              </div>
              <Button variant="outline" className="bg-card/60 backdrop-blur-xl border-0">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-0 bg-card/60 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(project.status)} text-white text-xs`}>
                            {project.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(project.priority)} text-white text-xs`}>
                            {project.priority}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.dueDate}</span>
                      </div>
                      <span>{project.lastActivity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.map((member, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">Assigned to {task.assignee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{task.status}</Badge>
                          <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                <CardHeader>
                  <CardTitle>Today's Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {meetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{meeting.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{meeting.participants}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                          Join
                        </Button>
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
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Video className="h-6 w-6 mb-2" />
                      Start Video Call
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MonitorSpeaker className="h-6 w-6 mb-2" />
                      Screen Share
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <MessageSquare className="h-6 w-6 mb-2" />
                      Team Chat
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Coffee className="h-6 w-6 mb-2" />
                      Coffee Break
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.flatMap(project => project.team).map((member, index) => (
                <Card key={index} className="border-0 bg-card/60 backdrop-blur-xl shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                    <div className="flex justify-center gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollaborationPage;
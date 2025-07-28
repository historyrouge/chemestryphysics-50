import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Eye, 
  Share2,
  Calendar,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalyticsPageProps {
  onNavigate?: (page: string) => void;
}

const AnalyticsPage = ({ onNavigate }: AnalyticsPageProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const engagementData = [
    { date: '2024-01-01', likes: 1250, comments: 340, shares: 120, views: 5600 },
    { date: '2024-01-02', likes: 1380, comments: 420, shares: 150, views: 6200 },
    { date: '2024-01-03', likes: 1100, comments: 280, shares: 90, views: 4800 },
    { date: '2024-01-04', likes: 1520, comments: 380, shares: 180, views: 7100 },
    { date: '2024-01-05', likes: 1420, comments: 460, shares: 200, views: 6800 },
    { date: '2024-01-06', likes: 1680, comments: 520, shares: 240, views: 8200 },
    { date: '2024-01-07', likes: 1890, comments: 580, shares: 290, views: 9100 },
  ];

  const audienceData = [
    { name: 'Space Enthusiasts', value: 35, color: '#8b5cf6' },
    { name: 'Astronomy Students', value: 25, color: '#06b6d4' },
    { name: 'Photographers', value: 20, color: '#10b981' },
    { name: 'Science Educators', value: 12, color: '#f59e0b' },
    { name: 'General Public', value: 8, color: '#ef4444' },
  ];

  const topPosts = [
    {
      id: '1',
      content: 'Amazing Aurora Borealis captured last night! The cosmic dance continues...',
      metrics: { likes: 2340, comments: 456, shares: 289, views: 12500 },
      engagement_rate: 18.7
    },
    {
      id: '2',
      content: 'New exoplanet discovery could change everything we know about life!',
      metrics: { likes: 1890, comments: 623, shares: 445, views: 15600 },
      engagement_rate: 19.2
    },
    {
      id: '3',
      content: 'Saturn through my telescope - you can see the Cassini Division!',
      metrics: { likes: 1560, comments: 234, shares: 167, views: 8900 },
      engagement_rate: 22.1
    }
  ];

  const growthData = [
    { month: 'Jan', followers: 1200, posts: 45, engagement: 16.2 },
    { month: 'Feb', followers: 1450, posts: 52, engagement: 17.8 },
    { month: 'Mar', followers: 1680, posts: 48, engagement: 19.1 },
    { month: 'Apr', followers: 1920, posts: 55, engagement: 20.4 },
    { month: 'May', followers: 2280, posts: 61, engagement: 18.9 },
    { month: 'Jun', followers: 2650, posts: 58, engagement: 21.3 },
  ];

  const totalStats = {
    totalFollowers: 2650,
    totalPosts: 319,
    totalLikes: 45600,
    totalViews: 234500,
    avgEngagement: 19.2,
    growth: 24.8
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Track your cosmic content performance
            </p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Followers</p>
                  <p className="text-2xl font-bold">{formatNumber(totalStats.totalFollowers)}</p>
                  <p className="text-xs text-green-400">+{totalStats.growth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Likes</p>
                  <p className="text-2xl font-bold">{formatNumber(totalStats.totalLikes)}</p>
                  <p className="text-xs text-green-400">+12.3%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{formatNumber(totalStats.totalViews)}</p>
                  <p className="text-xs text-green-400">+18.7%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Posts</p>
                  <p className="text-2xl font-bold">{totalStats.totalPosts}</p>
                  <p className="text-xs text-green-400">+8.2%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-2xl font-bold">{totalStats.avgEngagement}%</p>
                  <p className="text-xs text-green-400">+2.1%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Best Post</p>
                  <p className="text-2xl font-bold">22.1%</p>
                  <p className="text-xs text-muted-foreground">engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Engagement Over Time */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Engagement Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="likes" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="comments" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="shares" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audience Breakdown */}
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Growth Chart */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Growth & Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line yAxisId="left" type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={3} />
                <Line yAxisId="left" type="monotone" dataKey="posts" stroke="#06b6d4" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                  <Badge variant="secondary">#{index + 1}</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatNumber(post.metrics.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {formatNumber(post.metrics.comments)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {formatNumber(post.metrics.shares)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(post.metrics.views)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{post.engagement_rate}%</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
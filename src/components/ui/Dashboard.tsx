import { TrendingUp, Heart, BarChart, Users, MessageCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
}

const StatsCard = ({ title, value, change, icon, positive = true }: StatsCardProps) => (
  <Card className="glass-effect hover-lift transition-all duration-300">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-accent/10 p-2 rounded-full">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className={`text-xs ${positive ? 'text-green-400' : 'text-destructive'}`}>
            {change}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function Dashboard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatsCard
        title="Followers"
        value="1.2K"
        change="+12.5%"
        icon={<Users className="h-5 w-5 text-accent" />}
      />
      <StatsCard
        title="Engagement"
        value="18.7%"
        change="+3.2%"
        icon={<TrendingUp className="h-5 w-5 text-green-400" />}
      />
      <StatsCard
        title="Likes"
        value="8.4K"
        change="+24.3%"
        icon={<Heart className="h-5 w-5 text-red-400" />}
      />
      <StatsCard
        title="Comments"
        value="523"
        change="+7.8%"
        icon={<MessageCircle className="h-5 w-5 text-blue-400" />}
      />
      <StatsCard
        title="Analytics"
        value="15.2%"
        change="-2.1%"
        icon={<BarChart className="h-5 w-5 text-purple-400" />}
        positive={false}
      />
      <StatsCard
        title="Rating"
        value="4.8"
        change="+0.3"
        icon={<Star className="h-5 w-5 text-yellow-400" fill="currentColor" />}
      />
    </div>
  );
}
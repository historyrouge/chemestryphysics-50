import { useState } from "react";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  UserPlus, 
  Bell, 
  Shield, 
  ExternalLink,
  Sparkles 
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProfileMenuProps {
  onNavigate?: (path: string) => void;
  onLogout?: () => void;
}

export function ProfileMenu({ onNavigate, onLogout }: ProfileMenuProps) {
  const { profile } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-accent/10"
        >
          <Avatar className="h-8 w-8 ring-2 ring-accent/20">
            <AvatarImage src={profile?.avatar_url || ''} alt={profile?.name} />
            <AvatarFallback className="bg-accent/20 text-accent">
              {profile?.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium">{profile?.name}</p>
            <p className="text-xs text-muted-foreground">@{profile?.username}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 glass-effect border-border shadow-glow-primary" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{profile?.name}</span>
              <Sparkles className="h-3 w-3 text-accent" fill="currentColor" />
            </div>
            <p className="text-xs text-muted-foreground">@{profile?.username}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate?.('notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            <div className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-xs font-semibold text-white">
              3
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate?.('analytics')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>Analytics</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => console.log('Premium clicked')}>
            <Shield className="mr-2 h-4 w-4 text-accent" />
            <span className="text-accent">Upgrade to Premium</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
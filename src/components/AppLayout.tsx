import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Bell, 
  Mail, 
  Bookmark, 
  Plus, 
  Upload,
  Compass, 
  Star, 
  Settings, 
  LogOut,
  TrendingUp,
  BarChart,
  Play,
  Search,
  Video as VideoIcon,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  X,
  Menu,
  PanelLeft,
  Sun,
  Moon,
  PlusCircle,
  Users,
  Sparkles
} from 'lucide-react';

// Pages
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import NotificationsPage from './NotificationsPage';
import MessagesPage from './MessagesPage';
import ExplorePage from './ExplorePage';
import BookmarksPage from './BookmarksPage';
import SettingsPage from './SettingsPage';
import TrendingPage from './TrendingPage';
import AnalyticsPage from './AnalyticsPage';
import StoriesPage from './StoriesPage';
import AdvancedSearchPage from './AdvancedSearchPage';
import LiveStreamPage from './LiveStreamPage';

// Components
import UploadModal from './UploadModal';
import StarField from './StarField';
import { NavItem, SidebarNav } from './ui/sidebar-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SearchModal } from '@/components/SearchModal';
import { NotificationCenter } from '@/components/NotificationCenter';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { useTheme } from 'next-themes';
import { useSocialStore } from '@/stores/socialStore';

const AppLayout = () => {
  const { logout, profile } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'post' | 'bit'>('post');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { initializeMockData } = useSocialStore();

  const handleOpenUpload = (type: 'post' | 'bit') => {
    setUploadType(type);
    setUploadModalOpen(true);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const navigationItems = [
    { href: "/home", title: "Home", icon: Home, onClick: () => handleNavigation('/home') },
    { href: "/profile", title: "Profile", icon: User, onClick: () => handleNavigation('/profile') },
    { href: "/notifications", title: "Notifications", icon: Bell, badge: "3", onClick: () => handleNavigation('/notifications') },
    { href: "/messages", title: "Messages", icon: Mail, onClick: () => handleNavigation('/messages') },
    { href: "/bookmarks", title: "Bookmarks", icon: Bookmark, onClick: () => handleNavigation('/bookmarks') },
  ];

  const discoverItems = [
    { href: "/explore", title: "Explore", icon: Compass, onClick: () => handleNavigation('/explore') },
    { href: "/trending", title: "Trending", icon: TrendingUp, onClick: () => handleNavigation('/trending') },
    { href: "/stories", title: "Stories", icon: Play, onClick: () => handleNavigation('/stories') },
    { href: "/search", title: "Advanced Search", icon: Search, onClick: () => handleNavigation('/search') },
    { href: "/livestream", title: "Live Stream", icon: VideoIcon, onClick: () => handleNavigation('/livestream') },
  ];

  const settingsItems = [
    { href: "/settings", title: "Settings", icon: Settings, onClick: () => handleNavigation('/settings') },
    { href: "/analytics", title: "Analytics", icon: BarChart, onClick: () => handleNavigation('/analytics') },
    { href: "/collaboration", title: "Collaboration", icon: Users, onClick: () => handleNavigation('/collaboration') },
    { href: "/creator-studio", title: "Creator Studio", icon: Sparkles, onClick: () => handleNavigation('/creator-studio') },
    { href: "/logout", title: "Logout", icon: LogOut, variant: "destructive" as const, onClick: () => logout() },
  ];

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/notifications')) return 'notifications';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/explore')) return 'explore';
    if (path.startsWith('/bookmarks')) return 'bookmarks';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/trending')) return 'trending';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/stories')) return 'stories';
    if (path.startsWith('/search')) return 'search';
    if (path.startsWith('/livestream')) return 'livestream';
    return 'home';
  };

  const renderPageTitle = () => {
    const currentPage = getCurrentPage();
    switch (currentPage) {
      case 'profile': return 'Profile';
      case 'notifications': return 'Notifications';
      case 'messages': return 'Messages';
      case 'explore': return 'Explore';
      case 'bookmarks': return 'Bookmarks';
      case 'settings': return 'Settings';
      case 'trending': return 'Trending';
      case 'analytics': return 'Analytics';
      case 'stories': return 'Stories';
      case 'search': return 'Advanced Search';
      case 'livestream': return 'Live Stream';
      case 'home':
      default: return 'Home';
    }
  };

  const renderCurrentPage = () => {
    const currentPage = getCurrentPage();
    switch (currentPage) {
      case 'profile':
        return <ProfilePage onNavigateBack={() => handleNavigation('/home')} />;
      case 'notifications':
        return <NotificationsPage onNavigateBack={() => handleNavigation('/home')} />;
      case 'messages':
        return <MessagesPage onNavigateBack={() => handleNavigation('/home')} />;
      case 'explore':
        return <ExplorePage onNavigateBack={() => handleNavigation('/home')} />;
      case 'bookmarks':
        return <BookmarksPage onNavigateBack={() => handleNavigation('/home')} />;
      case 'settings':
        return <SettingsPage onNavigateBack={() => handleNavigation('/home')} onLogout={logout} />;
      case 'trending':
        return <TrendingPage onNavigate={handleNavigation} />;
      case 'analytics':
        return <AnalyticsPage onNavigate={handleNavigation} />;
      case 'stories':
        return <StoriesPage onNavigate={handleNavigation} />;
      case 'search':
        return <AdvancedSearchPage onNavigate={handleNavigation} />;
      case 'livestream':
        return <LiveStreamPage onNavigate={handleNavigation} />;
      case 'home':
      default:
        return (
          <HomePage 
            onLogout={logout}
            onNavigate={handleNavigation}
            onOpenUpload={handleOpenUpload}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <StarField />
      
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-30 h-screen w-60 hidden md:flex flex-col glass-effect border-r border-border">
        <div className="p-4 flex items-center gap-3">
          <Star className="w-8 h-8 text-accent" fill="currentColor" />
          <span className="text-xl font-bold text-accent">Celestial</span>
        </div>
        
        {/* User Profile */}
        <div className="p-4 flex items-center gap-3 hover:bg-accent/10 rounded-lg mx-2 cursor-pointer" onClick={() => handleNavigation('profile')}>
          <Avatar className="w-10 h-10 ring-2 ring-accent/20">
            <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
            <AvatarFallback>
              {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{profile?.name}</p>
            <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
          <SidebarNav 
            title="Navigation" 
            items={navigationItems} 
          />
          
          <SidebarNav 
            title="Discover" 
            items={discoverItems} 
          />
          
          <SidebarNav 
            title="Settings" 
            items={settingsItems} 
          />
        </div>
        
        <div className="p-4 mt-auto">
          <Button 
            variant="cosmic" 
            size="lg"
            className="w-full justify-center gap-2"
            onClick={() => handleOpenUpload('post')}
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Post</span>
          </Button>
        </div>
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-full max-w-xs glass-effect p-0 border-r border-border">
          <div className="h-full flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-accent" fill="currentColor" />
                <span className="text-xl font-bold text-accent">Celestial</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-accent" />
              </Button>
            </div>
            
            {/* User Profile */}
            <div className="p-4 flex items-center gap-3 hover:bg-accent/10 rounded-lg mx-2 cursor-pointer" onClick={() => handleNavigation('profile')}>
              <Avatar className="w-10 h-10 ring-2 ring-accent/20">
                <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                <AvatarFallback>
                  {profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{profile?.name}</p>
                <p className="text-xs text-muted-foreground">@{profile?.username}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
              <SidebarNav 
                title="Navigation" 
                items={navigationItems} 
              />
              
              <SidebarNav 
                title="Discover" 
                items={discoverItems} 
              />
              
              <SidebarNav 
                title="Settings" 
                items={settingsItems} 
              />
            </div>
            
            <div className="p-4 mt-auto">
              <Button 
                variant="cosmic" 
                size="lg"
                className="w-full justify-center gap-2"
                onClick={() => {
                  handleOpenUpload('post');
                  setSidebarOpen(false);
                }}
              >
                <PlusCircle className="h-5 w-5" />
                <span>New Post</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-20 glass-effect border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-accent" />
              </Button>
              <h1 className="text-xl font-bold hidden md:block">{renderPageTitle()}</h1>
              <div className="md:hidden flex items-center gap-3">
                <Star className="w-7 h-7 text-accent" fill="currentColor" />
                <span className="text-lg font-bold text-accent">Celestial</span>
              </div>
            </div>
            
            <div className="flex-1 max-w-xl mx-6 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Celestial..."
                  className="pl-10 bg-input/50 border-border focus:border-accent cursor-pointer"
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-accent hover:bg-accent/10"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="relative text-accent hover:bg-accent/10"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-white">
                  3
                </div>
              </Button>
              
              <ThemeToggle />
              
              <Button
                variant="cosmic"
                size="sm"
                className="hidden md:flex items-center gap-2"
                onClick={() => handleOpenUpload('post')}
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </Button>
              
              <ProfileMenu onNavigate={handleNavigation} onLogout={logout} />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 relative z-10">
          {renderCurrentPage()}
        </main>
      </div>
      
      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        type={uploadType}
      />
      
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      
      <NotificationCenter 
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
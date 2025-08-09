import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Star } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarField from "./components/StarField";

const HomePage = lazy(() => import("./components/HomePage"));
const ProfilePage = lazy(() => import("./components/ProfilePage"));
const NotificationsPage = lazy(() => import("./components/NotificationsPage"));
const MessagesPage = lazy(() => import("./components/MessagesPage"));
const BookmarksPage = lazy(() => import("./components/BookmarksPage"));
const ExplorePage = lazy(() => import("./components/ExplorePage"));
const TrendingPage = lazy(() => import("./components/TrendingPage"));
const StoriesPage = lazy(() => import("./components/StoriesPage"));
const AdvancedSearchPage = lazy(() => import("./components/AdvancedSearchPage"));
const LiveStreamPage = lazy(() => import("./components/LiveStreamPage"));
const SettingsPage = lazy(() => import("./components/SettingsPage"));
const AnalyticsPage = lazy(() => import("./components/AnalyticsPage"));
const CollaborationPage = lazy(() => import("./components/CollaborationPage"));
const CreatorStudioPage = lazy(() => import("./components/CreatorStudioPage"));
const AppLayout = lazy(() => import("./components/AppLayout"));
const AuthPage = lazy(() => import("./components/AuthPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, refetchOnWindowFocus: false, staleTime: 60_000 },
    mutations: { retry: 1 },
  },
});

const LogoutHandler = ({ onLogout }: { onLogout: () => Promise<void> }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleLogout = async () => {
      await onLogout();
      navigate('/', { replace: true });
    };
    handleLogout();
  }, [onLogout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <StarField />
      <div className="glass-effect p-8 rounded-3xl relative z-10 flex items-center gap-3">
        <Star className="w-8 h-8 text-accent animate-pulse" fill="currentColor" />
        <span className="text-xl font-bold text-accent">Logging out...</span>
      </div>
    </div>
  );
};

const SuspenseFallback = (
  <div className="min-h-screen flex items-center justify-center">
    <StarField />
    <div className="glass-effect p-8 rounded-3xl relative z-10 flex items-center gap-3">
      <Star className="w-8 h-8 text-accent animate-pulse" fill="currentColor" />
      <span className="text-xl font-bold text-accent">Loading Celestial...</span>
    </div>
  </div>
);

const AppContent = () => {
  const { user, loading, logout } = useUser();

  if (loading) {
    return SuspenseFallback;
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Suspense fallback={SuspenseFallback}>
          <Routes>
            <Route path="*" element={<AuthPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={SuspenseFallback}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage onNavigateBack={() => window.history.back()} />} />
            <Route path="notifications" element={<NotificationsPage onNavigateBack={() => window.history.back()} />} />
            <Route path="messages" element={<MessagesPage onNavigateBack={() => window.history.back()} />} />
            <Route path="bookmarks" element={<BookmarksPage onNavigateBack={() => window.history.back()} />} />
            <Route path="explore" element={<ExplorePage onNavigateBack={() => window.history.back()} />} />
            <Route path="trending" element={<TrendingPage />} />
            <Route path="stories" element={<StoriesPage />} />
            <Route path="search" element={<AdvancedSearchPage />} />
            <Route path="livestream" element={<LiveStreamPage />} />
            <Route path="settings" element={<SettingsPage onNavigateBack={() => window.history.back()} onLogout={logout} />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="collaboration" element={<CollaborationPage />} />
            <Route path="creator-studio" element={<CreatorStudioPage />} />
            <Route path="logout" element={<LogoutHandler onLogout={logout} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage";
import NotificationsPage from "./components/NotificationsPage";
import MessagesPage from "./components/MessagesPage";
import BookmarksPage from "./components/BookmarksPage";
import ExplorePage from "./components/ExplorePage";
import TrendingPage from "./components/TrendingPage";
import StoriesPage from "./components/StoriesPage";
import AdvancedSearchPage from "./components/AdvancedSearchPage";
import LiveStreamPage from "./components/LiveStreamPage";
import SettingsPage from "./components/SettingsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import CollaborationPage from "./components/CollaborationPage";
import CreatorStudioPage from "./components/CreatorStudioPage";
import AppLayout from "./components/AppLayout";
import AuthPage from "./components/AuthPage";

const queryClient = new QueryClient();

const AppContent = () => {
  // Always show main app (public mode)
  return (
    <BrowserRouter>
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
          <Route path="settings" element={<SettingsPage onNavigateBack={() => window.history.back()} onLogout={() => {}} />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="collaboration" element={<CollaborationPage />} />
          <Route path="creator-studio" element={<CreatorStudioPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
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

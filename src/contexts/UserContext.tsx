import { createContext, useContext, ReactNode } from 'react';
import { User as AuthUser, Session } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabasePosts } from '@/hooks/useSupabasePosts';

type Profile = Tables<'profiles'>;
type Post = Tables<'posts'>;

interface PostWithProfile extends Post {
  profiles: Profile;
  is_liked?: boolean;
}

interface UserContextType {
  // Auth state
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  
  // Posts state
  posts: PostWithProfile[];
  postsLoading: boolean;
  hasMorePosts: boolean;
  
  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // Post actions
  createPost: (content: string, imageUrl?: string) => Promise<{ success: boolean; error?: string }>;
  toggleLike: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<{ success: boolean; error?: string }>;
  loadMorePosts: () => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Mock user and authentication functions for public mode
  const mockUser = null;
  const mockProfile = null;
  const mockSession = null;
  const loading = false;

  const {
    posts,
    loading: postsLoading,
    hasMore: hasMorePosts,
    createPost,
    toggleLike,
    deletePost,
    loadMore: loadMorePosts,
    refresh: refreshPosts,
  } = useSupabasePosts();

  const value: UserContextType = {
    // Auth state - all null/false for public mode
    user: mockUser,
    profile: mockProfile,
    session: mockSession,
    loading,
    
    // Posts state
    posts,
    postsLoading,
    hasMorePosts,
    
    // Auth actions - mock functions for public mode
    login: async () => ({ success: false, error: 'Public mode - no authentication' }),
    register: async () => ({ success: false, error: 'Public mode - no authentication' }),
    logout: async () => {},
    updateProfile: async () => ({ success: false, error: 'Public mode - no authentication' }),
    resetPassword: async () => ({ success: false, error: 'Public mode - no authentication' }),
    
    // Post actions
    createPost,
    toggleLike,
    deletePost,
    loadMorePosts,
    refreshPosts,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
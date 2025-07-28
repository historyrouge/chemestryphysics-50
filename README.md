# Celestial Social Sphere

A modern, feature-rich social media platform built with React, TypeScript, and Supabase. Experience cosmic interactions with real-time updates, advanced engagement features, and a beautiful dark-themed UI.

## ✨ Features

### 🔐 Enhanced Authentication System
- **Secure Login/Signup** with email verification
- **Real-time session management** with automatic profile creation
- **Password reset functionality** 
- **Username validation** to prevent duplicates
- **Persistent sessions** across browser restarts

### 📱 Real-time Social Features
- **Live post updates** - See new posts instantly without refreshing
- **Real-time like synchronization** across all connected users
- **Live comment notifications** and updates
- **Instant interaction feedback** with optimistic UI updates

### 💬 Advanced Comment System
- **Threaded conversations** with up to 3 levels of nesting
- **Comment likes and reactions** with real-time counts
- **Reply to specific comments** with visual threading
- **Comment deletion** for comment authors
- **Load more pagination** for large comment threads

### 🎨 Content Creation & Management
- **Rich post creation modal** with:
  - Image upload support (up to 5MB)
  - Hashtag management system
  - Character count limits (500 chars)
  - Image preview before posting
- **Quick post composer** in the main feed
- **Post deletion** for post authors
- **Content moderation** ready structure

### ⚡ Advanced Interactions
- **Multiple reaction types** (coming soon - emoji reactions)
- **Smart bookmarking system** with personal collections
- **Native sharing** with Web Share API fallback
- **Infinite scroll** for seamless content browsing
- **Optimistic UI updates** for instant feedback

### 🗃️ Data Management
- **Supabase integration** replacing all mock data
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Efficient pagination** with cursor-based loading
- **Automatic profile creation** on user signup

### 📊 Database Schema
```sql
- profiles (user information)
- posts (main content)
- post_likes (like tracking)
- comments (threaded comments)
- comment_likes (comment reactions)
- stories (24h temporary content)
- reactions (emoji reactions)
- bookmarks (saved content)
- follows (user relationships)
- messages (direct messaging)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Environment Setup
1. Clone the repository
```bash
git clone <repository-url>
cd celestial-social-sphere
```

2. Install dependencies
```bash
npm install
```

3. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration file: `supabase/migrations/001_initial_schema.sql`
   - Update your Supabase URL and anon key in `src/integrations/supabase/client.ts`

4. Start the development server
```bash
npm run dev
```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom cosmic theme
- **Radix UI** components for accessibility
- **React Query** for server state management
- **Zustand** for client state management
- **React Router** for navigation

### Backend & Database
- **Supabase** for backend services
- **PostgreSQL** with advanced features
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates
- **Triggers and functions** for automation

### Key Patterns
- **Custom Hooks** for data fetching and state management
- **Context API** for global authentication state
- **Real-time subscriptions** using Supabase channels
- **Optimistic updates** for better UX
- **Error boundaries** for graceful error handling

## 🔧 Custom Hooks

### `useSupabaseAuth`
Handles all authentication operations with automatic profile management.

### `useSupabasePosts` 
Manages posts with real-time updates, infinite scrolling, and optimistic UI.

### `useComments`
Provides threaded comment system with real-time updates and pagination.

## 🎯 Real-time Features

The app uses Supabase's real-time capabilities to provide live updates:

- **Posts**: New posts appear instantly across all connected clients
- **Likes**: Like counts update in real-time for all users viewing a post
- **Comments**: New comments and replies appear immediately
- **User Status**: Online/offline status and activity indicators

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **User authentication** required for all write operations
- **Content ownership verification** before allowing modifications
- **Input validation** and sanitization
- **Rate limiting** ready infrastructure

## 📱 Mobile Optimization

- **Responsive design** works perfectly on all device sizes
- **Touch-friendly interactions** with proper tap targets
- **Mobile-first approach** with progressive enhancement
- **Offline-ready** structure for future PWA features

## 🎨 UI/UX Features

- **Dark theme** with cosmic-inspired design
- **Smooth animations** and transitions
- **Loading states** for all async operations
- **Empty states** with helpful messaging
- **Error handling** with user-friendly messages
- **Accessibility** features with proper ARIA labels

## 🔮 Future Enhancements

- [ ] **Stories feature** with 24-hour expiration
- [ ] **Direct messaging** system
- [ ] **Advanced search** with filters
- [ ] **User verification** system
- [ ] **Content collections** and saved posts
- [ ] **Push notifications** for mobile
- [ ] **Video uploads** and streaming
- [ ] **Live streaming** capabilities
- [ ] **AI-powered content moderation**
- [ ] **Analytics dashboard** for creators

## 🤝 Contributing

This project welcomes contributions! Please see the contributing guidelines for more information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using modern web technologies for the next generation of social media.

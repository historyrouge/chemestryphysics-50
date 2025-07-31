import { create } from 'zustand';

export interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
}

export interface Bit {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Story {
  id: string;
  title: string;
  content?: string;
  mediaUrl?: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  timestamp: string;
  expiresAt: string;
  views: number;
  isOwn?: boolean;
}

interface SocialStore {
  posts: Post[];
  bits: Bit[];
  stories: Story[];
  bookmarkedPosts: string[];
  bookmarkedBits: string[];
  
  // Actions
  toggleLikePost: (postId: string) => void;
  toggleLikeBit: (bitId: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  toggleBookmarkBit: (bitId: string) => void;
  addComment: (postId: string, content: string) => void;
  addCommentToBit: (bitId: string, content: string) => void;
  sharePost: (postId: string) => void;
  shareBit: (bitId: string) => void;
  addStory: (story: Omit<Story, 'id' | 'timestamp' | 'expiresAt'>) => void;
  
  // Initialize with mock data
  initializeMockData: () => void;
}

export const useSocialStore = create<SocialStore>((set, get) => ({
  posts: [],
  bits: [],
  stories: [],
  bookmarkedPosts: [],
  bookmarkedBits: [],

  toggleLikePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      ),
    }));
  },

  toggleLikeBit: (bitId: string) => {
    set((state) => ({
      bits: state.bits.map((bit) =>
        bit.id === bitId
          ? {
              ...bit,
              isLiked: !bit.isLiked,
              likes: bit.isLiked ? bit.likes - 1 : bit.likes + 1,
            }
          : bit
      ),
    }));
  },

  toggleLikeComment: (postId: string, commentId: string) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    }
                  : comment
              ),
            }
          : post
      ),
    }));
  },

  toggleBookmarkPost: (postId: string) => {
    set((state) => {
      const isBookmarked = state.bookmarkedPosts.includes(postId);
      return {
        posts: state.posts.map((post) =>
          post.id === postId ? { ...post, isBookmarked: !isBookmarked } : post
        ),
        bookmarkedPosts: isBookmarked
          ? state.bookmarkedPosts.filter((id) => id !== postId)
          : [...state.bookmarkedPosts, postId],
      };
    });
  },

  toggleBookmarkBit: (bitId: string) => {
    set((state) => {
      const isBookmarked = state.bookmarkedBits.includes(bitId);
      return {
        bits: state.bits.map((bit) =>
          bit.id === bitId ? { ...bit, isBookmarked: !isBookmarked } : bit
        ),
        bookmarkedBits: isBookmarked
          ? state.bookmarkedBits.filter((id) => id !== bitId)
          : [...state.bookmarkedBits, bitId],
      };
    });
  },

  addComment: (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        username: "currentuser",
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ),
    }));
  },

  addCommentToBit: (bitId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      content,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        username: "currentuser",
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    set((state) => ({
      bits: state.bits.map((bit) =>
        bit.id === bitId
          ? { ...bit, comments: [...bit.comments, newComment] }
          : bit
      ),
    }));
  },

  sharePost: (postId: string) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post
      ),
    }));
  },

  shareBit: (bitId: string) => {
    set((state) => ({
      bits: state.bits.map((bit) =>
        bit.id === bitId ? { ...bit, shares: bit.shares + 1 } : bit
      ),
    }));
  },

  addStory: (storyData: Omit<Story, 'id' | 'timestamp' | 'expiresAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: Date.now().toString(),
      timestamp: 'now',
      expiresAt: '24h remaining',
    };

    set((state) => ({
      stories: [newStory, ...state.stories],
    }));
  },

  initializeMockData: () => {
    const mockPosts: Post[] = [
      {
        id: "1",
        content: "Just discovered a new constellation tonight! The stars are absolutely magnificent ✨",
        author: {
          name: "Luna Stardust",
          avatar: "/placeholder.svg",
          username: "lunastardust",
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: [
          {
            id: "c1",
            content: "Amazing! Which constellation did you spot?",
            author: {
              name: "Cosmic Explorer",
              avatar: "/placeholder.svg",
              username: "cosmicexplorer",
            },
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            likes: 3,
            isLiked: false,
          },
        ],
        shares: 5,
        isLiked: false,
        isBookmarked: false,
        imageUrl: "/placeholder.svg",
      },
      {
        id: "2",
        content: "The cosmos is calling... Time for another deep space meditation session 🌌",
        author: {
          name: "Nebula Dreams",
          avatar: "/placeholder.svg",
          username: "nebuladreams",
        },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 18,
        comments: [],
        shares: 3,
        isLiked: false,
        isBookmarked: false,
      },
    ];

    const mockBits: Bit[] = [
      {
        id: "1",
        title: "Saturn's Rings Dance",
        description: "Watch the mesmerizing dance of Saturn's rings in this stunning space footage",
        videoUrl: "/placeholder.svg",
        thumbnail: "/placeholder.svg",
        duration: "0:30",
        views: 1250,
        likes: 89,
        comments: [
          {
            id: "bc1",
            content: "This is absolutely breathtaking!",
            author: {
              name: "Space Lover",
              avatar: "/placeholder.svg",
              username: "spacelover",
            },
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            likes: 5,
            isLiked: false,
          },
        ],
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        author: {
          name: "Astro Videographer",
          avatar: "/placeholder.svg",
          username: "astrovideographer",
        },
      },
    ];

    const mockStories: Story[] = [
      {
        id: "1",
        title: "Amazing Aurora Display",
        content: "Captured this incredible aurora display last night!",
        mediaUrl: "/placeholder.svg",
        author: {
          name: "Cosmic Explorer",
          avatar: "/placeholder.svg",
          username: "cosmicexplorer",
        },
        timestamp: "2h ago",
        expiresAt: "22h remaining",
        views: 1250,
        isOwn: false,
      },
    ];

    set({ posts: mockPosts, bits: mockBits, stories: mockStories });
  },
}));
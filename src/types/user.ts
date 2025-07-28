export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  joinedDate: string;
  followers: number;
  following: number;
  verified: boolean;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  reposts: number;
  comments: number;
  isLiked?: boolean;
  isReposted?: boolean;
}

export interface Bit {
  id: string;
  author: User;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SAMPLE_USERS = [
  {
    user_id: 'demo-user-001',
    username: 'cosmic_explorer',
    name: 'Cosmic Explorer',
    bio: 'Exploring the infinite possibilities of the universe ✨',
    avatar_url: null,
  },
  {
    user_id: 'demo-user-002',
    username: 'stellar_dreamer',
    name: 'Stellar Dreamer',
    bio: 'Dreaming among the stars 🌟',
    avatar_url: null,
  },
  {
    user_id: 'demo-user-003',
    username: 'nebula_artist',
    name: 'Nebula Artist',
    bio: 'Creating beauty in the cosmic canvas 🎨',
    avatar_url: null,
  },
];

const SAMPLE_POSTS = [
  {
    content: "Welcome to Celestial! 🌟 A beautiful space where cosmic minds connect across the universe. Share your thoughts, dreams, and discoveries with fellow explorers! ✨",
    user_id: 'demo-user-001',
  },
  {
    content: "Just watched the most incredible sunset tonight 🌅 There's something magical about the way light dances across the sky. What natural phenomena inspire you the most?",
    user_id: 'demo-user-002',
  },
  {
    content: "Working on a new digital art piece inspired by nebulas 🎨 The way colors swirl and blend in space is absolutely mesmerizing. Art truly mimics the universe!",
    user_id: 'demo-user-003',
  },
  {
    content: "Fun fact: Did you know that there are more possible games of chess than there are atoms in the observable universe? 🤯 The complexity of simple systems never ceases to amaze me!",
    user_id: 'demo-user-001',
  },
  {
    content: "Sometimes I wonder what life would be like on other planets 🪐 Would they have their own version of social media? What would alien memes look like? 👽",
    user_id: 'demo-user-002',
  },
  {
    content: "The James Webb telescope images are absolutely breathtaking 🔭 We're living in such an incredible time for space exploration and discovery!",
    user_id: 'demo-user-003',
  },
];

export const useInitialData = () => {
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if we already have posts
        const { data: existingPosts } = await supabase
          .from('posts')
          .select('id')
          .limit(1);

        // Only initialize if no posts exist
        if (!existingPosts || existingPosts.length === 0) {
          console.log('Initializing sample data...');
          
          // Insert sample users
          for (const user of SAMPLE_USERS) {
            await supabase
              .from('profiles')
              .upsert(user, { onConflict: 'user_id' });
          }

          // Insert sample posts
          for (const post of SAMPLE_POSTS) {
            await supabase
              .from('posts')
              .insert(post);
          }

          console.log('Sample data initialized successfully!');
        }
      } catch (error) {
        console.log('Note: Sample data initialization skipped (likely due to RLS policies)');
        // This is expected in production environments with Row Level Security
      }
    };

    initializeData();
  }, []);
};

export default useInitialData;
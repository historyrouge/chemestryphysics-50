-- Add foreign key constraints that reference auth.users properly
ALTER TABLE public.follows 
ADD CONSTRAINT follows_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.follows 
ADD CONSTRAINT follows_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES auth.users(id) ON DELETE CASCADE;
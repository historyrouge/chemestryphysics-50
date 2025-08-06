-- First, let's check and fix the follows table foreign keys
SELECT constraint_name, table_name FROM information_schema.table_constraints 
WHERE table_name = 'follows' AND constraint_type = 'FOREIGN KEY';

-- Drop all existing foreign key constraints on follows table
DO $$ 
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN 
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'follows' AND constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE 'ALTER TABLE public.follows DROP CONSTRAINT ' || constraint_record.constraint_name;
    END LOOP;
END $$;

-- Now add the correct foreign key constraints that reference auth.users
ALTER TABLE public.follows 
ADD CONSTRAINT follows_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.follows 
ADD CONSTRAINT follows_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix the conversation_participants table to have proper relationship with profiles
-- First ensure there's a foreign key from conversation_participants to profiles
ALTER TABLE public.conversation_participants 
ADD CONSTRAINT conversation_participants_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
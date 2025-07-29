-- Update RLS policies to allow public access
-- Drop existing policies that require authentication
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can like posts" ON public.likes;
DROP POLICY IF EXISTS "Users can unlike posts" ON public.likes;

-- Create new public policies
CREATE POLICY "Anyone can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update posts" 
ON public.posts FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete posts" 
ON public.posts FOR DELETE 
USING (true);

CREATE POLICY "Anyone can like posts" 
ON public.likes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can unlike posts" 
ON public.likes FOR DELETE 
USING (true);
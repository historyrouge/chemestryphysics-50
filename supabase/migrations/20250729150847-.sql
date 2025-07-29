-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create comments table that was referenced in the code but not created
CREATE TABLE public.comments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table
CREATE TABLE public.comment_likes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for comment likes
CREATE POLICY "Comment likes are viewable by everyone" 
ON public.comment_likes FOR SELECT 
USING (true);

CREATE POLICY "Users can like comments" 
ON public.comment_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" 
ON public.comment_likes FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for timestamp updates
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
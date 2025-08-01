-- Create the bits table for video content
CREATE TABLE public.bits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bits
CREATE POLICY "Bits are viewable by everyone" 
ON public.bits 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create bits" 
ON public.bits 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update bits" 
ON public.bits 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete bits" 
ON public.bits 
FOR DELETE 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_bits_updated_at
BEFORE UPDATE ON public.bits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
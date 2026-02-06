-- Create enum for ad status
CREATE TYPE public.ad_status AS ENUM ('requested', 'approved');

-- Create user_ads table for product advertisements
CREATE TABLE public.user_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  usecase TEXT,
  app_link TEXT,
  web_link TEXT,
  github_link TEXT,
  image_url TEXT,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  status ad_status NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_ads ENABLE ROW LEVEL SECURITY;

-- RLS Policies - everyone can view approved ads
CREATE POLICY "Anyone can view approved ads" 
ON public.user_ads 
FOR SELECT 
USING (status = 'approved' OR true);

-- Anyone can insert ads (no auth required)
CREATE POLICY "Anyone can submit ads" 
ON public.user_ads 
FOR INSERT 
WITH CHECK (true);

-- Anyone can update ads (for admin CMS - no auth)
CREATE POLICY "Anyone can update ads" 
ON public.user_ads 
FOR UPDATE 
USING (true);

-- Anyone can delete ads (for admin CMS)
CREATE POLICY "Anyone can delete ads" 
ON public.user_ads 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_user_ads_updated_at
BEFORE UPDATE ON public.user_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for ad images
INSERT INTO storage.buckets (id, name, public) VALUES ('ad-images', 'ad-images', true);

-- Storage policies for ad images
CREATE POLICY "Ad images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ad-images');

CREATE POLICY "Anyone can upload ad images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'ad-images');

CREATE POLICY "Anyone can update ad images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'ad-images');

CREATE POLICY "Anyone can delete ad images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'ad-images');
-- Add image URLs array to concepts table
ALTER TABLE public.concepts
ADD COLUMN IF NOT EXISTS images text[];

-- Create storage bucket for concept images
INSERT INTO storage.buckets (id, name, public)
VALUES ('concept-images', 'concept-images', true)
ON CONFLICT (id) DO NOTHING;

-- Update RLS policies to allow INSERT operations on categories
CREATE POLICY "Allow insert on categories"
ON public.categories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update on categories"
ON public.categories
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete on categories"
ON public.categories
FOR DELETE
TO public
USING (true);

-- Update RLS policies to allow INSERT operations on subcategories
CREATE POLICY "Allow insert on subcategories"
ON public.subcategories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update on subcategories"
ON public.subcategories
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete on subcategories"
ON public.subcategories
FOR DELETE
TO public
USING (true);

-- Update RLS policies to allow INSERT operations on concepts
CREATE POLICY "Allow insert on concepts"
ON public.concepts
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow update on concepts"
ON public.concepts
FOR UPDATE
TO public
USING (true);

CREATE POLICY "Allow delete on concepts"
ON public.concepts
FOR DELETE
TO public
USING (true);

-- Storage policies for concept images
CREATE POLICY "Allow public uploads to concept-images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'concept-images');

CREATE POLICY "Allow public access to concept-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'concept-images');

CREATE POLICY "Allow public updates to concept-images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'concept-images');

CREATE POLICY "Allow public deletes from concept-images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'concept-images');
-- Add new columns to concepts table
ALTER TABLE public.concepts 
ADD COLUMN why_to_use TEXT,
ADD COLUMN when_to_use TEXT,
ADD COLUMN learning_resources TEXT;

COMMENT ON COLUMN public.concepts.why_to_use IS 'Explains the benefits and reasons to use this concept';
COMMENT ON COLUMN public.concepts.when_to_use IS 'Describes the situations and contexts where this concept should be applied';
COMMENT ON COLUMN public.concepts.learning_resources IS 'List of URLs and resources to learn this concept';
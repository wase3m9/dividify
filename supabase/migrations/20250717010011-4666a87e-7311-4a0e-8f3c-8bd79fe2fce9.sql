-- Add address field to shareholders table
ALTER TABLE public.shareholders 
ADD COLUMN address TEXT;
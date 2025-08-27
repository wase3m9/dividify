-- Add logo_url to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create branding bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for branding bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read branding'
  ) THEN
    CREATE POLICY "Public read branding"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'branding');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users upload their own branding'
  ) THEN
    CREATE POLICY "Users upload their own branding"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'branding' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users update their own branding'
  ) THEN
    CREATE POLICY "Users update their own branding"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'branding' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users delete their own branding'
  ) THEN
    CREATE POLICY "Users delete their own branding"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'branding' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;
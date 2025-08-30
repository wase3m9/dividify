-- Fix: create storage policies for dividend_vouchers bucket using correct pg_policies column names

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can insert their own files (dividend_vouchers)'
  ) THEN
    CREATE POLICY "Users can insert their own files (dividend_vouchers)"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'dividend_vouchers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can read their own files (dividend_vouchers)'
  ) THEN
    CREATE POLICY "Users can read their own files (dividend_vouchers)"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'dividend_vouchers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own files (dividend_vouchers)'
  ) THEN
    CREATE POLICY "Users can update their own files (dividend_vouchers)"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'dividend_vouchers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    )
    WITH CHECK (
      bucket_id = 'dividend_vouchers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their own files (dividend_vouchers)'
  ) THEN
    CREATE POLICY "Users can delete their own files (dividend_vouchers)"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'dividend_vouchers'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

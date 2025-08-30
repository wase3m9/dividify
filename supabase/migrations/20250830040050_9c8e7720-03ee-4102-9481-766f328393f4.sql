-- Storage RLS policies for dividend_vouchers bucket using user-id folder prefix
-- Note: We guard creation with DO blocks to avoid duplicate-policy errors on re-run

-- INSERT policy: allow authenticated users to upload into their own user-id folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND polname = 'Users can insert their own files (dividend_vouchers)'
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

-- SELECT policy: allow users to read only their own files in this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND polname = 'Users can read their own files (dividend_vouchers)'
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

-- UPDATE policy: allow users to update their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND polname = 'Users can update their own files (dividend_vouchers)'
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

-- DELETE policy: allow users to delete their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND polname = 'Users can delete their own files (dividend_vouchers)'
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

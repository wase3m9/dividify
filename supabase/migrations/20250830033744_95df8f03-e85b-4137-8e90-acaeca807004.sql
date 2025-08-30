-- Fix storage policies for dividend_vouchers bucket to allow proper user folder structure
DROP POLICY IF EXISTS "Users can upload their own dividend vouchers" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own dividend vouchers" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own dividend vouchers" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own dividend vouchers" ON storage.objects;

-- Create corrected policies for dividend_vouchers bucket
CREATE POLICY "Users can upload dividend vouchers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view dividend vouchers"
ON storage.objects FOR SELECT
USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update dividend vouchers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete dividend vouchers"
ON storage.objects FOR DELETE
USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Also fix board_minutes policies to match the same pattern
DROP POLICY IF EXISTS "Users can upload their own board minutes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own board minutes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own board minutes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own board minutes" ON storage.objects;

CREATE POLICY "Users can upload board minutes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view board minutes"
ON storage.objects FOR SELECT
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update board minutes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete board minutes"
ON storage.objects FOR DELETE
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);
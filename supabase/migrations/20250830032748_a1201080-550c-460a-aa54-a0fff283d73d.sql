-- Create board_minutes storage bucket for storing board minutes PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('board_minutes', 'Board Minutes', false, 52428800, ARRAY['application/pdf']);

-- Create RLS policies for board_minutes bucket
CREATE POLICY "Users can upload their own board minutes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own board minutes"
ON storage.objects FOR SELECT
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own board minutes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own board minutes"
ON storage.objects FOR DELETE
USING (bucket_id = 'board_minutes' AND auth.uid()::text = (storage.foldername(name))[1]);
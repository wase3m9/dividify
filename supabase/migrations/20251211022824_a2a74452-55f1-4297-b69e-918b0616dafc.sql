-- Create sent_emails table for tracking email history
CREATE TABLE public.sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  related_type TEXT NOT NULL, -- 'voucher', 'minutes', 'mixed'
  related_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of document IDs
  to_emails TEXT NOT NULL,
  cc_emails TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent' | 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sent emails"
ON public.sent_emails
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sent emails"
ON public.sent_emails
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Block anonymous access to sent emails"
ON public.sent_emails
FOR ALL
USING (false)
WITH CHECK (false);

-- Create index for faster lookups
CREATE INDEX idx_sent_emails_company_id ON public.sent_emails(company_id);
CREATE INDEX idx_sent_emails_user_id ON public.sent_emails(user_id);
-- Fix contact_submissions RLS policies by removing conflicting permissive policies
-- and ensuring only admins can access the data

-- First, drop ALL existing SELECT policies on contact_submissions to eliminate conflicts
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous SELECT on contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON public.contact_submissions;

-- Create a single, secure admin-only SELECT policy (PERMISSIVE, not RESTRICTIVE)
-- This is the only SELECT policy needed - it allows admins to view, denies everyone else
CREATE POLICY "Admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also add INSERT policy so contact form can work via edge function (service role)
-- Block direct anonymous inserts - the edge function uses service role which bypasses RLS
CREATE POLICY "Block anonymous contact inserts" 
ON public.contact_submissions 
FOR INSERT 
TO anon
WITH CHECK (false);

-- Block authenticated users from inserting directly (edge function handles this)
CREATE POLICY "Block direct contact inserts" 
ON public.contact_submissions 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Block all updates
CREATE POLICY "Block contact updates" 
ON public.contact_submissions 
FOR UPDATE 
USING (false);

-- Block all deletes  
CREATE POLICY "Block contact deletes" 
ON public.contact_submissions 
FOR DELETE 
USING (false);
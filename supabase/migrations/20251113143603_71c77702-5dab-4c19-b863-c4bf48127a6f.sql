-- Fix: Remove permissive SELECT policy on contact_submissions
-- This prevents authenticated users from viewing other users' contact form submissions
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

-- The table already has these policies which are correct:
-- "Admins can view contact submissions" - allows admins to view all submissions
-- "Only admins can view contact submissions" - redundant but harmless
-- Keep the INSERT policy that allows public form submissions
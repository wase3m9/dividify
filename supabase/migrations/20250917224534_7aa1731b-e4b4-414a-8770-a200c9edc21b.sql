-- Fix RLS policies for officers table to properly protect sensitive personal data
-- The current policies use 'public' role which doesn't apply to authenticated users

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own officers" ON public.officers;
DROP POLICY IF EXISTS "Users can delete their own officers" ON public.officers;
DROP POLICY IF EXISTS "Users can update their own officers" ON public.officers;
DROP POLICY IF EXISTS "Users can view their own officers" ON public.officers;

-- Create new policies that properly target authenticated users
CREATE POLICY "Users can create their own officers" 
ON public.officers 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own officers" 
ON public.officers 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own officers" 
ON public.officers 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own officers" 
ON public.officers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Also fix dividend_records table policies for completeness
DROP POLICY IF EXISTS "Users can create their own dividend records" ON public.dividend_records;
DROP POLICY IF EXISTS "Users can delete their own dividend records" ON public.dividend_records;
DROP POLICY IF EXISTS "Users can update their own dividend records" ON public.dividend_records;
DROP POLICY IF EXISTS "Users can view their own dividend records" ON public.dividend_records;

CREATE POLICY "Users can create their own dividend records" 
ON public.dividend_records 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dividend records" 
ON public.dividend_records 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own dividend records" 
ON public.dividend_records 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own dividend records" 
ON public.dividend_records 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);
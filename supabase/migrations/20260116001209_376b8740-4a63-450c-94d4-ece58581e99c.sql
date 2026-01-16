-- Fix SECURITY DEFINER functions to add proper authorization checks
-- This prevents any authenticated user from incrementing another user's counters

-- Update increment_monthly_dividends with auth check
CREATE OR REPLACE FUNCTION public.increment_monthly_dividends(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate caller has permission (must be the user themselves or an admin)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: authentication required';
  END IF;
  
  IF auth.uid() != user_id_param AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: cannot increment counters for other users';
  END IF;
  
  UPDATE public.profiles 
  SET current_month_dividends = COALESCE(current_month_dividends, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$$;

-- Update increment_monthly_minutes with auth check
CREATE OR REPLACE FUNCTION public.increment_monthly_minutes(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate caller has permission (must be the user themselves or an admin)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: authentication required';
  END IF;
  
  IF auth.uid() != user_id_param AND NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: cannot increment counters for other users';
  END IF;
  
  UPDATE public.profiles 
  SET current_month_minutes = COALESCE(current_month_minutes, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$$;
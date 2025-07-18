-- Create function to increment monthly dividends count
CREATE OR REPLACE FUNCTION public.increment_monthly_dividends(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET current_month_dividends = COALESCE(current_month_dividends, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$$;
-- Create function to increment monthly minutes count
CREATE OR REPLACE FUNCTION public.increment_monthly_minutes(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.profiles 
  SET current_month_minutes = COALESCE(current_month_minutes, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$function$;
-- Fix function search path for security - Update existing functions to have secure search path
CREATE OR REPLACE FUNCTION public.increment_monthly_dividends(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET current_month_dividends = COALESCE(current_month_dividends, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_monthly_minutes(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles 
  SET current_month_minutes = COALESCE(current_month_minutes, 0) + 1,
      updated_at = now()
  WHERE id = user_id_param;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, subscription_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'trial'
  );
  RETURN NEW;
END;
$function$;
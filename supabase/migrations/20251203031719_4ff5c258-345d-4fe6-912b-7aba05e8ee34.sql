-- Drop the existing view that has SECURITY DEFINER warning
DROP VIEW IF EXISTS public.admin_dashboard_metrics;

-- Create a secure function with explicit admin check
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics()
RETURNS TABLE (
  total_users bigint,
  individual_users bigint,
  accountant_users bigint,
  active_subscriptions bigint,
  trial_users bigint,
  trials_expiring_soon bigint,
  total_companies bigint,
  dividends_this_month bigint,
  minutes_this_month bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access this data
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT count(*) FROM profiles)::bigint AS total_users,
    (SELECT count(*) FROM profiles WHERE user_type = 'individual')::bigint AS individual_users,
    (SELECT count(*) FROM profiles WHERE user_type = 'accountant')::bigint AS accountant_users,
    (SELECT count(*) FROM subscriptions WHERE status = 'active')::bigint AS active_subscriptions,
    (SELECT count(*) FROM profiles WHERE subscription_plan = 'trial')::bigint AS trial_users,
    (SELECT count(*) FROM profiles WHERE subscription_plan = 'trial' AND created_at < now() - interval '6 days')::bigint AS trials_expiring_soon,
    (SELECT count(*) FROM companies)::bigint AS total_companies,
    (SELECT count(*) FROM dividend_records WHERE created_at >= date_trunc('month', now()))::bigint AS dividends_this_month,
    (SELECT count(*) FROM minutes WHERE created_at >= date_trunc('month', now()))::bigint AS minutes_this_month;
END;
$$;
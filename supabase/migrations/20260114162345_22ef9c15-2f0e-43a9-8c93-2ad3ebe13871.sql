-- Fix SECURITY DEFINER functions missing authorization checks

-- 1. Fix get_subscription_metrics() - Add admin check
CREATE OR REPLACE FUNCTION public.get_subscription_metrics()
 RETURNS TABLE(total_mrr numeric, active_subscriptions_count bigint, trial_subscriptions_count bigint, past_due_count bigint, canceled_this_month bigint, trial_conversions_this_month bigint, starter_count bigint, professional_count bigint, enterprise_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  RETURN QUERY
  WITH subscription_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'active') as active_count,
      COUNT(*) FILTER (WHERE status = 'trialing') as trial_count,
      COUNT(*) FILTER (WHERE status = 'past_due') as past_due_count,
      COUNT(*) FILTER (WHERE status = 'canceled' AND updated_at >= DATE_TRUNC('month', NOW())) as canceled_month,
      COUNT(*) FILTER (WHERE status = 'active' AND plan_code != 'trial' AND created_at >= DATE_TRUNC('month', NOW())) as conversions_month,
      COUNT(*) FILTER (WHERE status = 'active' AND plan_code = 'starter') as starter,
      COUNT(*) FILTER (WHERE status = 'active' AND plan_code = 'professional') as professional,
      COUNT(*) FILTER (WHERE status = 'active' AND plan_code = 'enterprise') as enterprise
    FROM subscriptions
  ),
  mrr_calc AS (
    SELECT
      COALESCE(SUM(
        CASE 
          WHEN plan_code = 'starter' THEN 19
          WHEN plan_code = 'professional' THEN 49
          WHEN plan_code = 'enterprise' THEN 199
          ELSE 0
        END
      ), 0) as mrr
    FROM subscriptions
    WHERE status = 'active'
  )
  SELECT
    mrr_calc.mrr,
    subscription_stats.active_count,
    subscription_stats.trial_count,
    subscription_stats.past_due_count,
    subscription_stats.canceled_month,
    subscription_stats.conversions_month,
    subscription_stats.starter,
    subscription_stats.professional,
    subscription_stats.enterprise
  FROM subscription_stats, mrr_calc;
END;
$function$;

-- 2. Fix increment_monthly_dividends() - Add ownership validation
CREATE OR REPLACE FUNCTION public.increment_monthly_dividends(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify caller owns this user_id or is admin
  IF auth.uid() != user_id_param AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: can only increment own counters';
  END IF;

  UPDATE profiles 
  SET current_month_dividends = COALESCE(current_month_dividends, 0) + 1
  WHERE id = user_id_param;
END;
$function$;

-- 3. Fix increment_monthly_minutes() - Add ownership validation
CREATE OR REPLACE FUNCTION public.increment_monthly_minutes(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify caller owns this user_id or is admin
  IF auth.uid() != user_id_param AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: can only increment own counters';
  END IF;

  UPDATE profiles 
  SET current_month_minutes = COALESCE(current_month_minutes, 0) + 1
  WHERE id = user_id_param;
END;
$function$;

-- 4. Fix reset_monthly_counters() - Add admin check
CREATE OR REPLACE FUNCTION public.reset_monthly_counters()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow admins
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  UPDATE profiles 
  SET current_month_dividends = 0, current_month_minutes = 0
  WHERE current_month_dividends > 0 OR current_month_minutes > 0;
END;
$function$;
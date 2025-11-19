-- Admin Subscription Management Functions

-- 1. Get subscription metrics overview
CREATE OR REPLACE FUNCTION public.get_subscription_metrics()
RETURNS TABLE(
  total_mrr numeric,
  active_subscriptions_count bigint,
  trial_subscriptions_count bigint,
  past_due_count bigint,
  canceled_this_month bigint,
  trial_conversions_this_month bigint,
  starter_count bigint,
  professional_count bigint,
  enterprise_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
$$;

-- 2. Get paginated subscriptions list with filters
CREATE OR REPLACE FUNCTION public.get_subscriptions_list(
  search_term text DEFAULT NULL,
  filter_status text DEFAULT NULL,
  filter_plan text DEFAULT NULL,
  page_size integer DEFAULT 20,
  page_number integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  plan_code text,
  status text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone,
  monthly_amount numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.user_id,
    u.email,
    p.full_name,
    s.plan_code,
    s.status,
    s.stripe_customer_id,
    s.stripe_subscription_id,
    s.current_period_start,
    s.current_period_end,
    s.created_at,
    CASE 
      WHEN s.plan_code = 'starter' THEN 19::numeric
      WHEN s.plan_code = 'professional' THEN 49::numeric
      WHEN s.plan_code = 'enterprise' THEN 199::numeric
      ELSE 0::numeric
    END as monthly_amount
  FROM subscriptions s
  LEFT JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN profiles p ON p.id = s.user_id
  WHERE
    (search_term IS NULL OR 
     u.email ILIKE '%' || search_term || '%' OR 
     p.full_name ILIKE '%' || search_term || '%')
    AND (filter_status IS NULL OR s.status = filter_status)
    AND (filter_plan IS NULL OR s.plan_code = filter_plan)
  ORDER BY s.created_at DESC
  LIMIT page_size
  OFFSET page_size * page_number;
END;
$$;

-- 3. Get detailed subscription information
CREATE OR REPLACE FUNCTION public.get_subscription_details(subscription_id_param uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  user_type text,
  logo_url text,
  plan_code text,
  status text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  monthly_amount numeric,
  company_count bigint,
  current_month_dividends integer,
  current_month_minutes integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.user_id,
    u.email,
    p.full_name,
    p.user_type,
    p.logo_url,
    s.plan_code,
    s.status,
    s.stripe_customer_id,
    s.stripe_subscription_id,
    s.current_period_start,
    s.current_period_end,
    s.created_at,
    s.updated_at,
    CASE 
      WHEN s.plan_code = 'starter' THEN 19::numeric
      WHEN s.plan_code = 'professional' THEN 49::numeric
      WHEN s.plan_code = 'enterprise' THEN 199::numeric
      ELSE 0::numeric
    END as monthly_amount,
    COUNT(DISTINCT c.id) as company_count,
    p.current_month_dividends,
    p.current_month_minutes
  FROM subscriptions s
  LEFT JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN profiles p ON p.id = s.user_id
  LEFT JOIN companies c ON c.user_id = s.user_id
  WHERE s.id = subscription_id_param
  GROUP BY s.id, u.email, p.full_name, p.user_type, p.logo_url, p.current_month_dividends, p.current_month_minutes;
END;
$$;

-- 4. Admin cancel subscription
CREATE OR REPLACE FUNCTION public.admin_cancel_subscription(
  subscription_id_param uuid,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get user_id for logging
  SELECT user_id INTO v_user_id FROM subscriptions WHERE id = subscription_id_param;
  
  -- Update subscription status
  UPDATE subscriptions
  SET 
    status = 'canceled',
    updated_at = NOW()
  WHERE id = subscription_id_param;
  
  -- Update profile subscription plan
  UPDATE profiles
  SET subscription_plan = 'trial'
  WHERE id = v_user_id;
  
  -- Log the admin action
  INSERT INTO activity_log (user_id, action, description, metadata)
  VALUES (
    auth.uid(),
    'admin_cancel_subscription',
    'Admin canceled user subscription',
    jsonb_build_object(
      'subscription_id', subscription_id_param,
      'target_user_id', v_user_id,
      'reason', reason,
      'timestamp', NOW()
    )
  );
END;
$$;

-- 5. Admin reactivate subscription
CREATE OR REPLACE FUNCTION public.admin_reactivate_subscription(
  subscription_id_param uuid,
  extend_days integer DEFAULT 30
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_plan_code text;
BEGIN
  -- Get user_id and plan for logging
  SELECT user_id, plan_code INTO v_user_id, v_plan_code 
  FROM subscriptions 
  WHERE id = subscription_id_param;
  
  -- Reactivate subscription
  UPDATE subscriptions
  SET 
    status = 'active',
    current_period_end = NOW() + (extend_days || ' days')::INTERVAL,
    updated_at = NOW()
  WHERE id = subscription_id_param;
  
  -- Update profile subscription plan
  UPDATE profiles
  SET subscription_plan = v_plan_code
  WHERE id = v_user_id;
  
  -- Log the admin action
  INSERT INTO activity_log (user_id, action, description, metadata)
  VALUES (
    auth.uid(),
    'admin_reactivate_subscription',
    'Admin reactivated user subscription',
    jsonb_build_object(
      'subscription_id', subscription_id_param,
      'target_user_id', v_user_id,
      'extend_days', extend_days,
      'timestamp', NOW()
    )
  );
END;
$$;
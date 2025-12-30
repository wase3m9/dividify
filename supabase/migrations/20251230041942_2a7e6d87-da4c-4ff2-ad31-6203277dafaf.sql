-- Fix: Add admin role authorization checks to all admin RPC functions
-- First drop existing functions, then recreate with admin checks

-- Drop functions first to allow return type changes
DROP FUNCTION IF EXISTS public.get_users_list(text, text, text, integer, integer);
DROP FUNCTION IF EXISTS public.get_user_details(uuid);
DROP FUNCTION IF EXISTS public.extend_user_trial(uuid, integer);
DROP FUNCTION IF EXISTS public.admin_update_user_profile(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.get_subscriptions_list(text, text, text, integer, integer);
DROP FUNCTION IF EXISTS public.get_subscription_details(uuid);
DROP FUNCTION IF EXISTS public.admin_cancel_subscription(uuid, text);
DROP FUNCTION IF EXISTS public.admin_reactivate_subscription(uuid, integer);

-- 1. Recreate get_users_list with admin check
CREATE OR REPLACE FUNCTION public.get_users_list(
  search_term text DEFAULT NULL,
  filter_user_type text DEFAULT NULL,
  filter_subscription_status text DEFAULT NULL,
  page_size integer DEFAULT 20,
  page_number integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  user_type text,
  subscription_plan text,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz,
  current_month_dividends integer,
  current_month_minutes integer,
  company_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    u.email::text,
    p.full_name,
    p.user_type,
    p.subscription_plan,
    COALESCE(s.status, 'none') as subscription_status,
    s.current_period_end,
    p.created_at,
    p.current_month_dividends,
    p.current_month_minutes,
    COUNT(DISTINCT c.id) as company_count
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
  LEFT JOIN companies c ON c.user_id = p.id
  WHERE 
    (search_term IS NULL OR 
     u.email ILIKE '%' || search_term || '%' OR 
     p.full_name ILIKE '%' || search_term || '%')
    AND (filter_user_type IS NULL OR p.user_type = filter_user_type)
    AND (filter_subscription_status IS NULL OR 
         (filter_subscription_status = 'active' AND s.status = 'active') OR
         (filter_subscription_status = 'trial' AND p.subscription_plan = 'trial' AND (s.status IS NULL OR s.status != 'active')) OR
         (filter_subscription_status = 'expired' AND s.status = 'canceled') OR
         (filter_subscription_status = 'none' AND s.id IS NULL AND p.subscription_plan != 'trial'))
  GROUP BY p.id, u.email, p.full_name, p.user_type, p.subscription_plan, s.status, s.current_period_end, p.created_at, p.current_month_dividends, p.current_month_minutes
  ORDER BY p.created_at DESC
  LIMIT page_size
  OFFSET page_size * page_number;
END;
$$;

-- 2. Recreate get_user_details with admin check (also allow users to view their own data)
CREATE OR REPLACE FUNCTION public.get_user_details(user_id_param uuid)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  user_type text,
  subscription_plan text,
  logo_url text,
  created_at timestamptz,
  current_month_dividends integer,
  current_month_minutes integer,
  subscription_id uuid,
  subscription_status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins/owners OR the user accessing their own data
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') AND auth.uid() != user_id_param THEN
    RAISE EXCEPTION 'Admin privileges required or must be accessing own data';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    u.email,
    p.full_name,
    p.user_type,
    p.subscription_plan,
    p.logo_url,
    p.created_at,
    p.current_month_dividends,
    p.current_month_minutes,
    s.id as subscription_id,
    s.status as subscription_status,
    s.current_period_start,
    s.current_period_end,
    s.stripe_customer_id,
    s.stripe_subscription_id
  FROM profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
  WHERE p.id = user_id_param;
END;
$$;

-- 3. Recreate extend_user_trial with admin check
CREATE OR REPLACE FUNCTION public.extend_user_trial(user_id_param uuid, days_to_extend integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  -- Update subscription period if exists
  UPDATE subscriptions
  SET current_period_end = current_period_end + (days_to_extend || ' days')::INTERVAL,
      updated_at = NOW()
  WHERE user_id = user_id_param AND status = 'active';
  
  -- If no active subscription, create or update one
  IF NOT FOUND THEN
    INSERT INTO subscriptions (user_id, plan_code, status, current_period_end)
    VALUES (user_id_param, 'trial', 'active', NOW() + (days_to_extend || ' days')::INTERVAL)
    ON CONFLICT (user_id) DO UPDATE
    SET current_period_end = NOW() + (days_to_extend || ' days')::INTERVAL,
        status = 'active',
        updated_at = NOW();
  END IF;
  
  -- Log the admin action
  INSERT INTO activity_log (user_id, action, description, metadata)
  VALUES (
    auth.uid(),
    'extend_trial',
    'Admin extended user trial',
    jsonb_build_object(
      'target_user_id', user_id_param,
      'days_extended', days_to_extend
    )
  );
END;
$$;

-- 4. Recreate admin_update_user_profile with admin check
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  user_id_param uuid,
  new_full_name text DEFAULT NULL,
  new_user_type text DEFAULT NULL,
  new_subscription_plan text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  UPDATE profiles
  SET 
    full_name = COALESCE(new_full_name, full_name),
    user_type = COALESCE(new_user_type, user_type),
    subscription_plan = COALESCE(new_subscription_plan, subscription_plan),
    updated_at = NOW()
  WHERE id = user_id_param;
  
  -- Log the admin action
  INSERT INTO activity_log (user_id, action, description, metadata)
  VALUES (
    auth.uid(),
    'update_user_profile',
    'Admin updated user profile',
    jsonb_build_object(
      'target_user_id', user_id_param,
      'changes', jsonb_build_object(
        'full_name', new_full_name,
        'user_type', new_user_type,
        'subscription_plan', new_subscription_plan
      )
    )
  );
END;
$$;

-- 5. Recreate get_subscriptions_list with admin check
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
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz,
  monthly_amount numeric
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

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

-- 6. Recreate get_subscription_details with admin check
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
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  monthly_amount numeric,
  company_count bigint,
  current_month_dividends integer,
  current_month_minutes integer
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

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

-- 7. Recreate admin_cancel_subscription with admin check
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
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

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

-- 8. Recreate admin_reactivate_subscription with admin check
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
  -- Only allow admins or owners
  IF NOT has_role(auth.uid(), 'admin') AND NOT has_role(auth.uid(), 'owner') THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

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
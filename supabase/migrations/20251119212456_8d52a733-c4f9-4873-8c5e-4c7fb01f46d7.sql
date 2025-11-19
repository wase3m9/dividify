-- Create function to get users list with subscription info for admin
CREATE OR REPLACE FUNCTION public.get_users_list(
  search_term TEXT DEFAULT NULL,
  filter_user_type TEXT DEFAULT NULL,
  filter_subscription_status TEXT DEFAULT NULL,
  page_size INTEGER DEFAULT 20,
  page_number INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  user_type TEXT,
  subscription_plan TEXT,
  subscription_status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  current_month_dividends INTEGER,
  current_month_minutes INTEGER,
  company_count BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    u.email,
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

-- Create function to get user details for admin
CREATE OR REPLACE FUNCTION public.get_user_details(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  user_type TEXT,
  subscription_plan TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  current_month_dividends INTEGER,
  current_month_minutes INTEGER,
  subscription_id UUID,
  subscription_status TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- Create function to extend user trial
CREATE OR REPLACE FUNCTION public.extend_user_trial(
  user_id_param UUID,
  days_to_extend INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- Create function to update user profile by admin
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  user_id_param UUID,
  new_full_name TEXT DEFAULT NULL,
  new_user_type TEXT DEFAULT NULL,
  new_subscription_plan TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
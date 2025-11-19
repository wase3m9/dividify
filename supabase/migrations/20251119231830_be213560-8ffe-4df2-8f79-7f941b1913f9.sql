-- Fix get_users_list function to handle email type mismatch
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
  current_period_end timestamp with time zone,
  created_at timestamp with time zone,
  current_month_dividends integer,
  current_month_minutes integer,
  company_count bigint
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
    u.email::text,  -- Cast email to text to fix type mismatch
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
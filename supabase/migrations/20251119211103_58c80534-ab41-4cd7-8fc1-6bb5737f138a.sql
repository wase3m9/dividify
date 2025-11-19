-- Fix audit_role_changes to handle migrations (when auth.uid() is NULL)
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO activity_log (user_id, action, description, metadata)
    VALUES (
      COALESCE(auth.uid(), OLD.user_id),  -- Use target user if no auth context
      'role_removed',
      'User role removed',
      jsonb_build_object(
        'target_user', OLD.user_id,
        'role', OLD.role,
        'operation', TG_OP
      )
    );
    RETURN OLD;
  ELSE
    INSERT INTO activity_log (user_id, action, description, metadata)
    VALUES (
      COALESCE(auth.uid(), NEW.created_by, NEW.user_id),  -- Use created_by or target user if no auth context
      'role_assigned',
      'User role assigned or modified',
      jsonb_build_object(
        'target_user', NEW.user_id,
        'role', NEW.role,
        'operation', TG_OP
      )
    );
    RETURN NEW;
  END IF;
END;
$function$;

-- Now set wase3m@hotmail.com as owner
INSERT INTO user_roles (user_id, role, created_by)
SELECT id, 'owner'::app_role, id
FROM auth.users
WHERE email = 'wase3m@hotmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create view for easy admin dashboard metrics
CREATE OR REPLACE VIEW admin_dashboard_metrics AS
SELECT
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE user_type = 'individual') as individual_users,
  (SELECT COUNT(*) FROM profiles WHERE user_type = 'accountant') as accountant_users,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
  (SELECT COUNT(*) FROM profiles WHERE subscription_plan = 'trial') as trial_users,
  (SELECT COUNT(*) FROM profiles WHERE subscription_plan = 'trial' AND created_at < NOW() - INTERVAL '6 days') as trials_expiring_soon,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM dividend_records WHERE created_at >= DATE_TRUNC('month', NOW())) as dividends_this_month,
  (SELECT COUNT(*) FROM minutes WHERE created_at >= DATE_TRUNC('month', NOW())) as minutes_this_month;

-- Grant access to the view
GRANT SELECT ON admin_dashboard_metrics TO authenticated;

-- Create function to get user growth data
CREATE OR REPLACE FUNCTION get_user_growth(days_back INTEGER DEFAULT 30)
RETURNS TABLE(date DATE, new_users BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as new_users
  FROM profiles
  WHERE created_at >= CURRENT_DATE - days_back
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
$$;

-- Create function to get document generation stats
CREATE OR REPLACE FUNCTION get_document_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE(date DATE, vouchers BIGINT, minutes BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(d.date, m.date) as date,
    COALESCE(d.vouchers, 0) as vouchers,
    COALESCE(m.minutes, 0) as minutes
  FROM (
    SELECT DATE(created_at) as date, COUNT(*) as vouchers
    FROM dividend_records
    WHERE created_at >= CURRENT_DATE - days_back
    GROUP BY DATE(created_at)
  ) d
  FULL OUTER JOIN (
    SELECT DATE(created_at) as date, COUNT(*) as minutes
    FROM minutes
    WHERE created_at >= CURRENT_DATE - days_back
    GROUP BY DATE(created_at)
  ) m ON d.date = m.date
  ORDER BY date DESC;
$$;
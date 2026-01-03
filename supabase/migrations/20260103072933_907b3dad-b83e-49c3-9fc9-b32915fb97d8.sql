-- Fix security_events view to properly enforce RLS by making it security invoker
-- This ensures the view respects RLS policies from underlying tables

-- Drop and recreate the view with security_invoker = true
DROP VIEW IF EXISTS public.security_events;

CREATE VIEW public.security_events 
WITH (security_invoker = true)
AS
SELECT 
  al.id,
  al.created_at,
  al.action,
  al.description,
  al.metadata,
  al.user_id,
  p.full_name,
  p.user_type
FROM activity_log al
LEFT JOIN profiles p ON al.user_id = p.id
WHERE al.action IN ('admin_action', 'role_assigned', 'role_removed', 'unauthorized_access')
ORDER BY al.created_at DESC;

-- Grant SELECT only to authenticated users (RLS will be enforced from activity_log)
GRANT SELECT ON public.security_events TO authenticated;
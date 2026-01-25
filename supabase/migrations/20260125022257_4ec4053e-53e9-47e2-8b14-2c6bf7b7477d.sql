-- Drop and recreate security_events as a SECURITY BARRIER view with admin-only access
DROP VIEW IF EXISTS public.security_events;

CREATE VIEW public.security_events
WITH (security_barrier = true, security_invoker = true) AS
SELECT
    al.id,
    al.user_id,
    al.action,
    al.description,
    al.metadata,
    al.created_at,
    p.full_name,
    p.user_type
FROM public.activity_log al
LEFT JOIN public.profiles p ON al.user_id = p.id
WHERE 
    al.action IN ('role_assigned', 'role_removed', 'admin_action', 'extend_trial', 'update_user_profile', 'admin_cancel_subscription', 'admin_reactivate_subscription')
    AND public.has_role(auth.uid(), 'admin'::app_role);

-- Revoke all default access
REVOKE ALL ON public.security_events FROM PUBLIC;
REVOKE ALL ON public.security_events FROM anon;

-- Grant SELECT only to authenticated users (view logic further restricts to admins)
GRANT SELECT ON public.security_events TO authenticated;

COMMENT ON VIEW public.security_events IS 'Security audit trail view - admin access only via has_role check';
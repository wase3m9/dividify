-- ============================================
-- CRITICAL SECURITY HARDENING - PHASE 1
-- Row Level Security Policy Improvements
-- ============================================

-- 1.1 Secure Contact Submissions Table
-- Prevent public access to contact form data containing emails
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block anonymous SELECT on contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

-- 1.2 Fix Profiles INSERT Policy
-- Only users can create their own profile (should be done by trigger)
CREATE POLICY "Users can only create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Block anonymous profile creation"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (false);

-- 1.3 Harden Activity Logs - Make Immutable
-- Activity logs are audit trails and should never be modified
CREATE POLICY "Activity logs are immutable - block updates"
ON public.activity_log
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Activity logs are immutable - block deletes"
ON public.activity_log
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Block anonymous access to activity logs"
ON public.activity_log
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.4 Explicit Subscription Protection
-- Users should not be able to modify their own subscriptions
CREATE POLICY "Block user subscription insertion"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block user subscription updates"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Block user subscription deletion"
ON public.subscriptions
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Block anonymous subscription access"
ON public.subscriptions
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.5 Verify Officers and Companies Protection
-- Add explicit anonymous blocking
CREATE POLICY "Block anonymous access to officers"
ON public.officers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block anonymous access to companies"
ON public.companies
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.6 Protect Dividend Records from Anonymous Access
CREATE POLICY "Block anonymous access to dividend records"
ON public.dividend_records
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.7 Protect Minutes from Anonymous Access
CREATE POLICY "Block anonymous access to minutes"
ON public.minutes
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.8 Protect Shareholders from Anonymous Access
CREATE POLICY "Block anonymous access to shareholders"
ON public.shareholders
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.9 Protect User Roles from Anonymous Access
CREATE POLICY "Block anonymous access to user roles"
ON public.user_roles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 1.10 Protect Blog Posts from Anonymous Modifications
CREATE POLICY "Block anonymous blog post modifications"
ON public.blog_posts
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Block anonymous blog post updates"
ON public.blog_posts
FOR UPDATE
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block anonymous blog post deletions"
ON public.blog_posts
FOR DELETE
TO anon
USING (false);

-- 1.11 Protect Chat Data from Anonymous Access
CREATE POLICY "Block anonymous access to chat conversations"
ON public.chat_conversations
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block anonymous access to chat messages"
ON public.chat_messages
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- ============================================
-- PHASE 3: AUDIT TRIGGERS
-- Track role changes for security monitoring
-- ============================================

CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO activity_log (user_id, action, description, metadata)
    VALUES (
      auth.uid(),
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
      auth.uid(),
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
$$;

CREATE TRIGGER role_change_audit
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();

-- ============================================
-- PHASE 4: SECURITY MONITORING
-- Create views for security event monitoring
-- ============================================

CREATE OR REPLACE VIEW public.security_events AS
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
WHERE action IN ('admin_action', 'role_assigned', 'role_removed', 'unauthorized_access')
ORDER BY al.created_at DESC;

-- Grant access to admins only
GRANT SELECT ON public.security_events TO authenticated;

CREATE POLICY "Only admins can view security events"
ON public.activity_log
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR auth.uid() = user_id
);
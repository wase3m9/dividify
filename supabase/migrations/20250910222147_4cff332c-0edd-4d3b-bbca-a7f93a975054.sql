-- Complete the admin role system setup with proper policies
DO $$
BEGIN
    -- Try to create security definer function if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN
        EXECUTE '
        CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
        RETURNS BOOLEAN
        LANGUAGE SQL
        STABLE
        SECURITY DEFINER
        SET search_path = public
        AS $$
          SELECT EXISTS (
            SELECT 1
            FROM public.user_roles
            WHERE user_id = _user_id
              AND role = _role
          )
        $$';
    END IF;
    
    -- Try to create audit logging function if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'log_admin_action') THEN
        EXECUTE '
        CREATE OR REPLACE FUNCTION public.log_admin_action(
          action_type TEXT,
          target_user_id UUID DEFAULT NULL,
          details JSONB DEFAULT ''{}''
        )
        RETURNS VOID
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
          INSERT INTO public.activity_log (
            user_id,
            action,
            description,
            metadata
          ) VALUES (
            auth.uid(),
            ''admin_action'',
            action_type,
            jsonb_build_object(
              ''action_type'', action_type,
              ''target_user_id'', target_user_id,
              ''details'', details,
              ''timestamp'', now()
            )
          );
        END;
        $$';
    END IF;
END
$$;

-- Update blog posts policy to use new role system
DROP POLICY IF EXISTS "Admin can manage blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;

CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Ensure RLS policies exist for user_roles table
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
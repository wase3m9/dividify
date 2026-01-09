-- Create ENUM for allowed event names
CREATE TYPE public.event_name_type AS ENUM (
  'generation_created',
  'generation_failed',
  'pdf_downloaded',
  'subscription_started',
  'subscription_cancelled',
  'api_call'
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NULL REFERENCES public.companies(id) ON DELETE SET NULL,
  event_name text NOT NULL CHECK (event_name IN ('generation_created', 'generation_failed', 'pdf_downloaded', 'subscription_started', 'subscription_cancelled', 'api_call')),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Create indexes for efficient querying
CREATE INDEX idx_events_created_at_desc ON public.events (created_at DESC);
CREATE INDEX idx_events_user_id ON public.events (user_id);
CREATE INDEX idx_events_event_name ON public.events (event_name);
CREATE INDEX idx_events_company_id ON public.events (company_id) WHERE company_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Block all anonymous access
CREATE POLICY "Block anonymous access to events"
ON public.events
FOR ALL
USING (false)
WITH CHECK (false);

-- Block regular authenticated users from reading events
CREATE POLICY "Block regular users from reading events"
ON public.events
FOR SELECT
USING (false);

-- Allow only admins to read events
CREATE POLICY "Admins can read events"
ON public.events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Block direct inserts from authenticated users
CREATE POLICY "Block direct inserts to events"
ON public.events
FOR INSERT
WITH CHECK (false);

-- Block updates to events
CREATE POLICY "Block updates to events"
ON public.events
FOR UPDATE
USING (false);

-- Block deletes from events
CREATE POLICY "Block deletes from events"
ON public.events
FOR DELETE
USING (false);

-- Revoke direct insert/update/delete from authenticated role
REVOKE INSERT, UPDATE, DELETE ON public.events FROM authenticated;

-- Create the log_event RPC function (security definer)
CREATE OR REPLACE FUNCTION public.log_event(
  p_event_name text,
  p_company_id uuid DEFAULT NULL,
  p_meta jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_allowed_events text[] := ARRAY['generation_created', 'generation_failed', 'pdf_downloaded', 'subscription_started', 'subscription_cancelled', 'api_call'];
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  
  -- Ensure user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to log events';
  END IF;
  
  -- Validate event name
  IF NOT (p_event_name = ANY(v_allowed_events)) THEN
    RAISE EXCEPTION 'Invalid event name: %. Allowed: %', p_event_name, v_allowed_events;
  END IF;
  
  -- Insert the event (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.events (user_id, company_id, event_name, meta)
  VALUES (v_user_id, p_company_id, p_event_name, COALESCE(p_meta, '{}'::jsonb));
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_event(text, uuid, jsonb) TO authenticated;

-- Create a service role function for server-side event logging (for webhooks)
CREATE OR REPLACE FUNCTION public.log_event_server(
  p_user_id uuid,
  p_event_name text,
  p_company_id uuid DEFAULT NULL,
  p_meta jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed_events text[] := ARRAY['generation_created', 'generation_failed', 'pdf_downloaded', 'subscription_started', 'subscription_cancelled', 'api_call'];
BEGIN
  -- Validate event name
  IF NOT (p_event_name = ANY(v_allowed_events)) THEN
    RAISE EXCEPTION 'Invalid event name: %. Allowed: %', p_event_name, v_allowed_events;
  END IF;
  
  -- Validate user_id
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required for server-side event logging';
  END IF;
  
  -- Insert the event
  INSERT INTO public.events (user_id, company_id, event_name, meta)
  VALUES (p_user_id, p_company_id, p_event_name, COALESCE(p_meta, '{}'::jsonb));
END;
$$;

-- Create RPC function to get event counts for admin dashboard
CREATE OR REPLACE FUNCTION public.get_event_counts(
  days_back integer DEFAULT 30
)
RETURNS TABLE (
  generation_created_count bigint,
  generation_failed_count bigint,
  pdf_downloaded_count bigint,
  api_call_count bigint,
  subscription_started_count bigint,
  subscription_cancelled_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) FILTER (WHERE event_name = 'generation_created') AS generation_created_count,
    COUNT(*) FILTER (WHERE event_name = 'generation_failed') AS generation_failed_count,
    COUNT(*) FILTER (WHERE event_name = 'pdf_downloaded') AS pdf_downloaded_count,
    COUNT(*) FILTER (WHERE event_name = 'api_call') AS api_call_count,
    COUNT(*) FILTER (WHERE event_name = 'subscription_started') AS subscription_started_count,
    COUNT(*) FILTER (WHERE event_name = 'subscription_cancelled') AS subscription_cancelled_count
  FROM public.events
  WHERE 
    created_at >= NOW() - (days_back || ' days')::interval
    AND has_role(auth.uid(), 'admin'::app_role);
$$;

-- Create RPC function to get event activity by day for charts
CREATE OR REPLACE FUNCTION public.get_event_activity(
  days_back integer DEFAULT 30
)
RETURNS TABLE (
  date date,
  generation_created bigint,
  generation_failed bigint,
  pdf_downloaded bigint,
  api_call bigint,
  subscription_started bigint,
  subscription_cancelled bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    DATE(created_at) AS date,
    COUNT(*) FILTER (WHERE event_name = 'generation_created') AS generation_created,
    COUNT(*) FILTER (WHERE event_name = 'generation_failed') AS generation_failed,
    COUNT(*) FILTER (WHERE event_name = 'pdf_downloaded') AS pdf_downloaded,
    COUNT(*) FILTER (WHERE event_name = 'api_call') AS api_call,
    COUNT(*) FILTER (WHERE event_name = 'subscription_started') AS subscription_started,
    COUNT(*) FILTER (WHERE event_name = 'subscription_cancelled') AS subscription_cancelled
  FROM public.events
  WHERE 
    created_at >= NOW() - (days_back || ' days')::interval
    AND has_role(auth.uid(), 'admin'::app_role)
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
$$;

-- Create RPC function to get user events (for admin user details view)
CREATE OR REPLACE FUNCTION public.get_user_events(
  target_user_id uuid,
  max_events integer DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  event_name text,
  company_id uuid,
  meta jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.id, e.created_at, e.event_name, e.company_id, e.meta
  FROM public.events e
  WHERE 
    e.user_id = target_user_id
    AND has_role(auth.uid(), 'admin'::app_role)
  ORDER BY e.created_at DESC
  LIMIT max_events;
$$;

-- Create RPC function to get user's document count this month from events
CREATE OR REPLACE FUNCTION public.get_user_docs_this_month(
  target_user_id uuid
)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.events
  WHERE 
    user_id = target_user_id
    AND event_name = 'generation_created'
    AND created_at >= DATE_TRUNC('month', NOW())
    AND has_role(auth.uid(), 'admin'::app_role);
$$;

-- Create RPC function to get latest subscription events for admin
CREATE OR REPLACE FUNCTION public.get_subscription_events(
  max_events integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  event_name text,
  meta jsonb,
  user_email text,
  user_full_name text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id,
    e.created_at,
    e.user_id,
    e.event_name,
    e.meta,
    u.email::text AS user_email,
    p.full_name AS user_full_name
  FROM public.events e
  LEFT JOIN auth.users u ON e.user_id = u.id
  LEFT JOIN public.profiles p ON e.user_id = p.id
  WHERE 
    e.event_name IN ('subscription_started', 'subscription_cancelled')
    AND has_role(auth.uid(), 'admin'::app_role)
  ORDER BY e.created_at DESC
  LIMIT max_events;
$$;
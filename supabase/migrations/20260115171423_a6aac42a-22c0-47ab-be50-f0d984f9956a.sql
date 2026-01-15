-- Update the handle_new_user function to fix the edge function authentication
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_response record;
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, full_name, user_type, subscription_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual'),
    'trial'
  );

  -- Send signup notification email using anon key (no auth required for this endpoint)
  BEGIN
    SELECT * INTO notification_response
    FROM extensions.http_post(
      'https://vkllrotescxmqwogfamo.supabase.co/functions/v1/notify-signup',
      jsonb_build_object(
        'user_id', NEW.id::text,
        'email', NEW.email,
        'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user_type', COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual'),
        'signup_plan', NEW.raw_user_meta_data->>'signup_plan'
      ),
      'application/json',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbGxyb3Rlc2N4bXF3b2dmYW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODUwMzksImV4cCI6MjA2ODE2MTAzOX0.wAcCBZQSTZZN1UBwN4hb2L9nBXbaG0DD_0nJhQkr7e0'
      )
    );
    RAISE NOTICE 'Signup notification sent for user %: %', NEW.email, notification_response;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log but don't fail the signup
      RAISE NOTICE 'Failed to send signup notification for %: %', NEW.email, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
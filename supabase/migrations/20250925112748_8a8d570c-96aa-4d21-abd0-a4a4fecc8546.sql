-- Remove extension from public schema and update function to use extensions schema
DROP EXTENSION IF EXISTS http;
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Update the handle_new_user function to use the extensions schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_response record;
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, subscription_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual'),
    'trial'
  );

  -- Send signup notification email (non-blocking)
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
        'Authorization', 'Bearer ' || current_setting('app.service_role_key', true)
      )
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE NOTICE 'Failed to send signup notification: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;
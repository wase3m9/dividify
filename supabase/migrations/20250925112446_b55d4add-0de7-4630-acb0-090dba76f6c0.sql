-- Update the handle_new_user function to also send signup notification
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_response jsonb;
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
    SELECT content INTO notification_response
    FROM http((
      'POST',
      'https://vkllrotescxmqwogfamo.supabase.co/functions/v1/notify-signup',
      ARRAY[
        http_header('Authorization', 'Bearer ' || current_setting('app.service_role_key', true)),
        http_header('Content-Type', 'application/json')
      ],
      jsonb_build_object(
        'user_id', NEW.id::text,
        'email', NEW.email,
        'full_name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'user_type', COALESCE(NEW.raw_user_meta_data->>'user_type', 'individual'),
        'signup_plan', NEW.raw_user_meta_data->>'signup_plan'
      )::text
    ));
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the user creation
      RAISE NOTICE 'Failed to send signup notification: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Create the admin user manually with the correct schema
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Insert the admin user into auth.users (this requires service role privileges)
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_user_meta_data,
        aud,
        role
    ) VALUES (
        gen_random_uuid(),
        'wase3m@hotmail.com',
        crypt('temporary_password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"full_name": "Admin User"}',
        'authenticated',
        'authenticated'
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt('temporary_password123', gen_salt('bf')),
        updated_at = now()
    RETURNING id INTO admin_user_id;

    -- Insert or update the profile for the admin user
    INSERT INTO public.profiles (
        id,
        full_name,
        subscription_plan,
        current_month_dividends,
        current_month_minutes
    ) VALUES (
        admin_user_id,
        'Admin User',
        'enterprise',
        0,
        0
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = 'Admin User',
        subscription_plan = 'enterprise',
        current_month_dividends = 0,
        current_month_minutes = 0,
        updated_at = now();
END $$;

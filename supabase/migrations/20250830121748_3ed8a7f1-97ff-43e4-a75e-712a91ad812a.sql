-- Update RPC functions to fix security warnings by setting search_path
CREATE OR REPLACE FUNCTION increment_monthly_dividends(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET current_month_dividends = COALESCE(current_month_dividends, 0) + 1
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION increment_monthly_minutes(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET current_month_minutes = COALESCE(current_month_minutes, 0) + 1
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION reset_monthly_counters()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET current_month_dividends = 0, current_month_minutes = 0
  WHERE current_month_dividends > 0 OR current_month_minutes > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION check_and_reset_monthly_counters(user_id_param UUID)
RETURNS void AS $$
DECLARE
  user_profile RECORD;
  user_subscription RECORD;
  current_period_start TIMESTAMP;
  last_reset_date DATE;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile FROM profiles WHERE id = user_id_param;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Get active subscription if exists
  SELECT * INTO user_subscription 
  FROM subscriptions 
  WHERE user_id = user_id_param AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Determine current period start
  IF FOUND THEN
    current_period_start := user_subscription.current_period_start;
  ELSE
    -- For trial users, use calendar month
    current_period_start := DATE_TRUNC('month', NOW());
  END IF;

  -- Check if we need to reset counters
  -- Reset if the user's last update was before current period start
  IF user_profile.updated_at < current_period_start THEN
    UPDATE profiles 
    SET 
      current_month_dividends = 0,
      current_month_minutes = 0,
      updated_at = NOW()
    WHERE id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
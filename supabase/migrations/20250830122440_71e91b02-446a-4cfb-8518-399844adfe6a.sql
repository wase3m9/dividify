
-- Reset monthly counters for the specified user email
WITH target_user AS (
  SELECT id
  FROM auth.users
  WHERE lower(email) = lower('wazamusa@hotmail.com')
  LIMIT 1
)
UPDATE public.profiles p
SET
  current_month_dividends = 0,
  current_month_minutes = 0,
  updated_at = now()
FROM target_user tu
WHERE p.id = tu.id
RETURNING p.id AS profile_id, p.current_month_dividends, p.current_month_minutes, p.updated_at;

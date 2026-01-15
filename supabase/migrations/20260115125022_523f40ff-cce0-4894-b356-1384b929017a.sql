-- Fix get_due_dividend_schedules() - Restrict to service_role only
-- This function is designed to be called by the process-scheduled-dividends Edge Function
-- which uses the service role key, not by client applications

-- Revoke execute from authenticated users and anon
REVOKE EXECUTE ON FUNCTION public.get_due_dividend_schedules() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_due_dividend_schedules() FROM anon;

-- Only service_role (Edge Functions) should call this
GRANT EXECUTE ON FUNCTION public.get_due_dividend_schedules() TO service_role;
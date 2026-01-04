-- Enable pg_cron and pg_net extensions for scheduled HTTP calls
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Schedule the process-scheduled-dividends function to run daily at 6:00 AM UTC
SELECT cron.schedule(
  'process-scheduled-dividends-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vkllrotescxmqwogfamo.supabase.co/functions/v1/process-scheduled-dividends',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbGxyb3Rlc2N4bXF3b2dmYW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1ODUwMzksImV4cCI6MjA2ODE2MTAzOX0.wAcCBZQSTZZN1UBwN4hb2L9nBXbaG0DD_0nJhQkr7e0"}'::jsonb,
    body := '{"triggered_by": "cron"}'::jsonb
  ) AS request_id;
  $$
);
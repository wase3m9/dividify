-- Create recurring_dividends table for scheduling automatic dividends
CREATE TABLE public.recurring_dividends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  shareholder_id UUID NOT NULL REFERENCES public.shareholders(id) ON DELETE CASCADE,
  
  -- Dividend details
  amount_per_share NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  share_class TEXT NOT NULL,
  number_of_shares INTEGER NOT NULL,
  
  -- Schedule configuration
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'annually')),
  day_of_month INTEGER NOT NULL CHECK (day_of_month >= 1 AND day_of_month <= 28),
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- State
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_paused BOOLEAN NOT NULL DEFAULT false,
  
  -- Email configuration
  email_recipients TEXT[] NOT NULL DEFAULT '{}',
  include_board_minutes BOOLEAN NOT NULL DEFAULT true,
  template_preference TEXT DEFAULT 'modern',
  
  -- Tracking
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled_dividend_runs table to track execution history
CREATE TABLE public.scheduled_dividend_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.recurring_dividends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Generated records
  dividend_record_id UUID REFERENCES public.dividend_records(id) ON DELETE SET NULL,
  minutes_record_id UUID REFERENCES public.minutes(id) ON DELETE SET NULL,
  
  -- Execution state
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  error_message TEXT,
  
  -- Scheduling
  scheduled_for DATE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE,
  
  -- Email tracking
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recurring_dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_dividend_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recurring_dividends
CREATE POLICY "Users can view their own schedules"
  ON public.recurring_dividends FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedules"
  ON public.recurring_dividends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules"
  ON public.recurring_dividends FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules"
  ON public.recurring_dividends FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Block anonymous access to recurring dividends"
  ON public.recurring_dividends FOR ALL
  USING (false)
  WITH CHECK (false);

-- RLS Policies for scheduled_dividend_runs
CREATE POLICY "Users can view their own runs"
  ON public.scheduled_dividend_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own runs"
  ON public.scheduled_dividend_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own runs"
  ON public.scheduled_dividend_runs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Block anonymous access to scheduled runs"
  ON public.scheduled_dividend_runs FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create indexes for performance
CREATE INDEX idx_recurring_dividends_user_id ON public.recurring_dividends(user_id);
CREATE INDEX idx_recurring_dividends_company_id ON public.recurring_dividends(company_id);
CREATE INDEX idx_recurring_dividends_next_run ON public.recurring_dividends(next_run_at) WHERE is_active = true AND is_paused = false;
CREATE INDEX idx_scheduled_runs_schedule_id ON public.scheduled_dividend_runs(schedule_id);
CREATE INDEX idx_scheduled_runs_status ON public.scheduled_dividend_runs(status) WHERE status = 'pending';

-- Add trigger for updated_at
CREATE TRIGGER update_recurring_dividends_updated_at
  BEFORE UPDATE ON public.recurring_dividends
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate next run date
CREATE OR REPLACE FUNCTION public.calculate_next_run_date(
  p_frequency TEXT,
  p_day_of_month INTEGER,
  p_last_run DATE DEFAULT NULL,
  p_start_date DATE DEFAULT CURRENT_DATE
)
RETURNS DATE
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_base_date DATE;
  v_next_date DATE;
BEGIN
  -- Use last run or start date as base
  v_base_date := COALESCE(p_last_run, p_start_date - INTERVAL '1 day');
  
  -- Calculate next date based on frequency
  CASE p_frequency
    WHEN 'monthly' THEN
      v_next_date := (DATE_TRUNC('month', v_base_date) + INTERVAL '1 month')::DATE;
    WHEN 'quarterly' THEN
      v_next_date := (DATE_TRUNC('month', v_base_date) + INTERVAL '3 months')::DATE;
    WHEN 'annually' THEN
      v_next_date := (DATE_TRUNC('month', v_base_date) + INTERVAL '12 months')::DATE;
  END CASE;
  
  -- Set to the correct day of month
  v_next_date := v_next_date + (p_day_of_month - 1);
  
  -- If next date is in the past or before start date, move forward
  WHILE v_next_date <= CURRENT_DATE OR v_next_date < p_start_date LOOP
    CASE p_frequency
      WHEN 'monthly' THEN
        v_next_date := v_next_date + INTERVAL '1 month';
      WHEN 'quarterly' THEN
        v_next_date := v_next_date + INTERVAL '3 months';
      WHEN 'annually' THEN
        v_next_date := v_next_date + INTERVAL '12 months';
    END CASE;
  END LOOP;
  
  RETURN v_next_date;
END;
$$;

-- Function to get schedules due for processing
CREATE OR REPLACE FUNCTION public.get_due_dividend_schedules()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  company_id UUID,
  shareholder_id UUID,
  amount_per_share NUMERIC,
  total_amount NUMERIC,
  share_class TEXT,
  number_of_shares INTEGER,
  frequency TEXT,
  day_of_month INTEGER,
  email_recipients TEXT[],
  include_board_minutes BOOLEAN,
  template_preference TEXT,
  company_name TEXT,
  company_address TEXT,
  company_reg_number TEXT,
  shareholder_name TEXT,
  shareholder_address TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    rd.id,
    rd.user_id,
    rd.company_id,
    rd.shareholder_id,
    rd.amount_per_share,
    rd.total_amount,
    rd.share_class,
    rd.number_of_shares,
    rd.frequency,
    rd.day_of_month,
    rd.email_recipients,
    rd.include_board_minutes,
    rd.template_preference,
    c.name as company_name,
    c.registered_address as company_address,
    c.registration_number as company_reg_number,
    s.shareholder_name,
    s.address as shareholder_address
  FROM recurring_dividends rd
  JOIN companies c ON c.id = rd.company_id
  JOIN shareholders s ON s.id = rd.shareholder_id
  WHERE rd.is_active = true
    AND rd.is_paused = false
    AND rd.next_run_at <= CURRENT_DATE
    AND (rd.end_date IS NULL OR rd.end_date >= CURRENT_DATE);
$$;
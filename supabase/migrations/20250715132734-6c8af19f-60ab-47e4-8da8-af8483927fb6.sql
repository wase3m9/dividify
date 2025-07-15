
-- Create profiles table with trigger for new users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  subscription_plan TEXT DEFAULT 'trial',
  current_month_dividends INTEGER DEFAULT 0,
  current_month_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  registration_number TEXT,
  registered_address TEXT,
  trade_classification TEXT,
  registered_email TEXT,
  incorporation_date DATE,
  place_of_registration TEXT,
  company_category TEXT,
  trading_on_market BOOLEAN DEFAULT FALSE,
  company_status TEXT DEFAULT 'Active',
  accounting_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create officers table
CREATE TABLE public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  forenames TEXT NOT NULL,
  surname TEXT NOT NULL,
  computed_full_name TEXT,
  position TEXT,
  address TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_appointment DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shareholders table
CREATE TABLE public.shareholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  shareholder_name TEXT,
  share_class TEXT NOT NULL,
  number_of_shares INTEGER NOT NULL,
  number_of_holders INTEGER DEFAULT 1,
  is_share_class BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dividend_records table
CREATE TABLE public.dividend_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  shareholder_name TEXT NOT NULL,
  share_class TEXT NOT NULL,
  number_of_shares INTEGER NOT NULL,
  dividend_per_share DECIMAL(10,4) NOT NULL,
  total_dividend DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  tax_year TEXT NOT NULL,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create minutes table
CREATE TABLE public.minutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  meeting_date DATE NOT NULL,
  meeting_type TEXT NOT NULL,
  attendees TEXT[] NOT NULL,
  resolutions TEXT[] NOT NULL,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dividend_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minutes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for companies
CREATE POLICY "Users can view their own companies" ON public.companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own companies" ON public.companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" ON public.companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" ON public.companies
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for officers
CREATE POLICY "Users can view their own officers" ON public.officers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own officers" ON public.officers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own officers" ON public.officers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own officers" ON public.officers
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for shareholders
CREATE POLICY "Users can view their own shareholders" ON public.shareholders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own shareholders" ON public.shareholders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shareholders" ON public.shareholders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shareholders" ON public.shareholders
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for dividend_records
CREATE POLICY "Users can view their own dividend records" ON public.dividend_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dividend records" ON public.dividend_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dividend records" ON public.dividend_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dividend records" ON public.dividend_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for minutes
CREATE POLICY "Users can view their own minutes" ON public.minutes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own minutes" ON public.minutes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own minutes" ON public.minutes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own minutes" ON public.minutes
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, subscription_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'trial'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for dividend vouchers
INSERT INTO storage.buckets (id, name, public) VALUES ('dividend_vouchers', 'dividend_vouchers', false);

-- Create storage policies for dividend vouchers
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'dividend_vouchers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add next_voucher_number field to companies table to track sequential voucher numbers per company
ALTER TABLE public.companies 
ADD COLUMN next_voucher_number integer NOT NULL DEFAULT 1;

-- Create a function to get and increment the next voucher number for a company
CREATE OR REPLACE FUNCTION public.get_next_voucher_number(company_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_number integer;
BEGIN
  -- Get current voucher number and increment it atomically
  UPDATE companies 
  SET next_voucher_number = next_voucher_number + 1
  WHERE id = company_id_param
  RETURNING next_voucher_number - 1 INTO current_number;
  
  -- Return the number that was used (before increment)
  RETURN current_number;
END;
$function$;
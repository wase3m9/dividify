import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  registered_address: string;
}

export const useCompanyData = (companyId: string | null) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError("Please sign in to continue");
          return;
        }

        if (!companyId) {
          setError("Please select a company before proceeding");
          return;
        }

        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (companyError) {
          console.error('Error fetching company:', companyError);
          setError("Unable to fetch company details. Please try again.");
          return;
        }

        if (!companyData) {
          setError("Company not found. Please make sure you have selected a valid company.");
          return;
        }

        setCompany(companyData);
        setError(null);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  return { company, error, isLoading };
};
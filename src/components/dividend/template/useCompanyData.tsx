
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  registered_address: string;
}

interface Officer {
  id: string;
  title: string;
  forenames: string;
  surname: string;
  address: string;
  email: string;
  position: string;
}

interface Shareholder {
  id: string;
  shareholder_name: string;
  share_class: string;
  number_of_shares: number;
}

export const useCompanyData = (companyId: string | null) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
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

        // Fetch company details
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

        // Fetch officers
        const { data: officersData, error: officersError } = await supabase
          .from('officers')
          .select('*')
          .eq('company_id', companyId)
          .eq('user_id', user.id);

        if (officersError) {
          console.error('Error fetching officers:', officersError);
        }

        // Fetch shareholders
        const { data: shareholdersData, error: shareholdersError } = await supabase
          .from('shareholders')
          .select('*')
          .eq('company_id', companyId)
          .eq('user_id', user.id)
          .eq('is_share_class', false);

        if (shareholdersError) {
          console.error('Error fetching shareholders:', shareholdersError);
        }

        setCompany(companyData);
        setOfficers(officersData || []);
        setShareholders(shareholdersData || []);
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

  return { company, officers, shareholders, error, isLoading };
};

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanySearchResult {
  company_name: string;
  company_number: string;
  status: string | null;
  address: any;
}

export interface CompanyDetails {
  company_name: string;
  company_number: string;
  status: string | null;
  date_of_creation: string | null;
  registered_office_address: any;
  accounting_reference_date?: { day: string | null; month: string | null };
  accounts_next_due?: string | null;
  accounts_last_made_up_to?: string | null;
  accounts_next_made_up_to?: string | null;
  confirmation_statement_next_due?: string | null;
  confirmation_statement_last_made_up_to?: string | null;
  confirmation_statement_next_made_up_to?: string | null;
  officers?: Array<{
    name: string;
    officer_role: string;
    appointed_on: string | null;
    resigned_on: string | null;
    nationality: string | null;
    occupation: string | null;
    country_of_residence: string | null;
    date_of_birth: { month: number; year: number } | null;
    address: any;
  }>;
}

export const useCompaniesHouse = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchCompanies = async (query: string): Promise<CompanySearchResult[]> => {
    if (!query || query.length < 2) return [];

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('companies-house', {
        body: { q: query }
      });

      if (error) throw error;
      if (!data.ok) throw new Error(data.error || 'Search failed');

      return data.results || [];
    } catch (error) {
      console.error('Company search error:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search companies. Please try again.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCompanyDetails = async (companyNumber: string, includeOfficers = false): Promise<CompanyDetails | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('companies-house', {
        body: { number: companyNumber, include_officers: includeOfficers }
      });

      if (error) throw error;
      if (!data.ok) throw new Error(data.error || 'Failed to fetch company details');

      return data;
    } catch (error) {
      console.error('Company details error:', error);
      toast({
        variant: "destructive",
        title: "Fetch Error",
        description: "Failed to fetch company details. Please try again.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: any): string => {
    if (!address) return '';
    
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.locality,
      address.region,
      address.postal_code,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return {
    searchCompanies,
    getCompanyDetails,
    formatAddress,
    isLoading
  };
};
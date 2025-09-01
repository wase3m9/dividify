
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useCompanyData = (selectedCompanyId?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }
      return user;
    },
    retry: false,
    meta: {
      errorHandler: () => {
        navigate('/auth');
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: selectedCompany } = useQuery({
    queryKey: ['company', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', selectedCompanyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  const { data: companies, refetch: refetchCompanies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: directors } = useQuery({
    queryKey: ['directors', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .eq('company_id', selectedCompanyId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  const { data: shareholders, refetch: refetchShareholders } = useQuery({
    queryKey: ['shareholders', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('shareholders')
        .select('*')
        .eq('company_id', selectedCompanyId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  const { data: shareClasses, refetch: refetchShareClasses } = useQuery({
    queryKey: ['shareClasses', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('shareholders')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .eq('is_share_class', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  const handleCompanyUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['company', selectedCompanyId] });
  };

  return {
    user,
    profile,
    selectedCompany,
    companies,
    directors,
    shareholders: shareholders?.filter(s => !s.is_share_class),
    shareClasses,
    refetchCompanies,
    refetchShareholders,
    refetchShareClasses,
    handleCompanyUpdate,
    displayName: profile?.full_name || user?.email?.split('@')[0] || '',
  };
};

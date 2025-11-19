import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserListItem {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  subscription_plan: string;
  subscription_status: string;
  current_period_end: string | null;
  created_at: string;
  current_month_dividends: number;
  current_month_minutes: number;
  company_count: number;
}

export interface UserDetails extends UserListItem {
  logo_url: string | null;
  subscription_id: string | null;
  current_period_start: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface UserFilters {
  searchTerm?: string;
  userType?: string;
  subscriptionStatus?: string;
  page?: number;
  pageSize?: number;
}

export const useUsersList = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users-list', filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_users_list', {
        search_term: filters.searchTerm || null,
        filter_user_type: filters.userType || null,
        filter_subscription_status: filters.subscriptionStatus || null,
        page_size: filters.pageSize || 20,
        page_number: filters.page || 0,
      });
      
      if (error) throw error;
      return (data || []) as UserListItem[];
    },
  });
};

export const useUserDetails = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase.rpc('get_user_details', {
        user_id_param: userId,
      });
      
      if (error) throw error;
      return data && data.length > 0 ? (data[0] as UserDetails) : null;
    },
    enabled: !!userId,
  });
};

export const useUserCompanies = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-companies', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useUserActivity = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useExtendTrial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, days }: { userId: string; days: number }) => {
      const { error } = await supabase.rpc('extend_user_trial', {
        user_id_param: userId,
        days_to_extend: days,
      });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success(`Trial extended by ${variables.days} days`);
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', variables.userId] });
    },
    onError: (error) => {
      toast.error(`Failed to extend trial: ${error.message}`);
    },
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      fullName, 
      userType, 
      subscriptionPlan 
    }: { 
      userId: string;
      fullName?: string;
      userType?: string;
      subscriptionPlan?: string;
    }) => {
      const { error } = await supabase.rpc('admin_update_user_profile', {
        user_id_param: userId,
        new_full_name: fullName || null,
        new_user_type: userType || null,
        new_subscription_plan: subscriptionPlan || null,
      });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      toast.success('User profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      queryClient.invalidateQueries({ queryKey: ['user-details', variables.userId] });
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityLogEntry {
  id: string;
  user_id: string;
  company_id?: string;
  action: string;
  description: string;
  metadata: any;
  created_at: string;
  companies?: {
    name: string;
  };
}

export const useActivityLog = (limit = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["activity-log", limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: activities, error } = await supabase
        .from('activity_log')
        .select(`
          *,
          companies:company_id (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return activities as ActivityLogEntry[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  return { data, isLoading, error };
};

export const useLogActivity = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      action,
      description,
      companyId,
      metadata = {}
    }: {
      action: string;
      description: string;
      companyId?: string;
      metadata?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.rpc('log_activity', {
        user_id_param: user.id,
        action_param: action,
        description_param: description,
        company_id_param: companyId || null,
        metadata_param: metadata
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-log"] });
    }
  });

  return mutation;
};
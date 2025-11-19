import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminCheck = () => {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { isAdmin: false, isOwner: false, role: null };
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .in('role', ['owner', 'admin']);
      
      if (!roles || roles.length === 0) {
        return { isAdmin: false, isOwner: false, role: null };
      }

      const hasOwner = roles.some(r => r.role === 'owner');
      const hasAdmin = roles.some(r => r.role === 'admin');
      const role = hasOwner ? 'owner' : hasAdmin ? 'admin' : null;
      
      return { 
        isAdmin: hasOwner || hasAdmin, 
        isOwner: hasOwner,
        role 
      };
    },
  });

  return { 
    isAdmin: adminData?.isAdmin ?? false, 
    isOwner: adminData?.isOwner ?? false,
    role: adminData?.role ?? null,
    isLoading 
  };
};
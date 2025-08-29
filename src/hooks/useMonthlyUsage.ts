import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMonthlyUsage = () => {
  return useQuery({
    queryKey: ["monthly-usage"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get subscription plan
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_plan")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      // Date range for current month (UTC)
      const now = new Date();
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
      const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

      // Parallel count queries
      const [companiesRes, dividendsRes, minutesRes] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase
          .from("dividend_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", start.toISOString())
          .lt("created_at", nextMonth.toISOString()),
        supabase
          .from("minutes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", start.toISOString())
          .lt("created_at", nextMonth.toISOString()),
      ]);

      if (companiesRes.error) throw companiesRes.error;
      if (dividendsRes.error) throw dividendsRes.error;
      if (minutesRes.error) throw minutesRes.error;

      // Get plan limits
      const getPlanLimits = (plan: string) => {
        switch (plan) {
          case 'professional':
            return { companies: 3, dividends: 10, minutes: 10 };
          case 'enterprise':
            return { companies: Infinity, dividends: Infinity, minutes: Infinity };
          default: // starter or trial
            return { companies: 1, dividends: 2, minutes: 2 };
        }
      };

      const limits = getPlanLimits(profile?.subscription_plan || "trial");

      return {
        plan: profile?.subscription_plan || "trial",
        companiesCount: companiesRes.count || 0,
        dividendsCount: dividendsRes.count || 0,
        minutesCount: minutesRes.count || 0,
        limits,
        // Calculate remaining quotas
        remainingDividends: Math.max(0, limits.dividends === Infinity ? Infinity : limits.dividends - (dividendsRes.count || 0)),
        remainingMinutes: Math.max(0, limits.minutes === Infinity ? Infinity : limits.minutes - (minutesRes.count || 0)),
      };
    },
  });
};

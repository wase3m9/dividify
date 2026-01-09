import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EventCounts {
  generation_created_count: number;
  generation_failed_count: number;
  pdf_downloaded_count: number;
  api_call_count: number;
  subscription_started_count: number;
  subscription_cancelled_count: number;
}

export interface EventActivityData {
  date: string;
  generation_created: number;
  generation_failed: number;
  pdf_downloaded: number;
  api_call: number;
  subscription_started: number;
  subscription_cancelled: number;
}

export interface UserEvent {
  id: string;
  created_at: string;
  event_name: string;
  company_id: string | null;
  meta: Record<string, unknown>;
}

export interface SubscriptionEvent {
  id: string;
  created_at: string;
  user_id: string;
  event_name: string;
  meta: Record<string, unknown>;
  user_email: string | null;
  user_full_name: string | null;
}

export const useEventCounts = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['event-counts', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_event_counts', { days_back: daysBack })
        .single();
      
      if (error) throw error;
      return data as EventCounts;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useEventActivity = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['event-activity', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_event_activity', { days_back: daysBack });
      
      if (error) throw error;
      return (data || []) as EventActivityData[];
    },
  });
};

export const useUserEvents = (userId: string | null, maxEvents: number = 50) => {
  return useQuery({
    queryKey: ['user-events', userId, maxEvents],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .rpc('get_user_events', { 
          target_user_id: userId,
          max_events: maxEvents 
        });
      
      if (error) throw error;
      return (data || []) as UserEvent[];
    },
    enabled: !!userId,
  });
};

export const useSubscriptionEvents = (maxEvents: number = 20) => {
  return useQuery({
    queryKey: ['subscription-events', maxEvents],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_subscription_events', { max_events: maxEvents });
      
      if (error) throw error;
      return (data || []) as SubscriptionEvent[];
    },
  });
};

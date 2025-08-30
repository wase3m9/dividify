import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, CreditCard, Calendar, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface UsageData {
  current_month_dividends: number;
  current_month_minutes: number;
  subscription_plan: string;
}

interface PlanLimits {
  dividends: number;
  minutes: number;
  isUnlimited: boolean;
}

export const UsageTracker = () => {
  const user = useUser();
  const { subscriptionData } = useSubscriptionStatus();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlanLimits = (plan: string): PlanLimits => {
    switch (plan?.toLowerCase()) {
      case 'trial':
      case 'starter':
        return { dividends: 2, minutes: 2, isUnlimited: false };
      case 'professional':
        return { dividends: 10, minutes: 10, isUnlimited: false };
      case 'enterprise':
      case 'accountant':
        return { dividends: 0, minutes: 0, isUnlimited: true };
      default:
        return { dividends: 2, minutes: 2, isUnlimited: false };
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsage();
      
      // Set up real-time subscription to profile changes
      const channel = supabase
        .channel('profile-usage-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new) {
              setUsage({
                current_month_dividends: payload.new.current_month_dividends || 0,
                current_month_minutes: payload.new.current_month_minutes || 0,
                subscription_plan: payload.new.subscription_plan || 'trial'
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchUsage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('current_month_dividends, current_month_minutes, subscription_plan')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUsage(data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const openUpgradeCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading || !usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
          <CardDescription>Loading your usage statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = subscriptionData?.subscription_tier || usage.subscription_plan;
  const limits = getPlanLimits(currentPlan);
  
  const dividendUsage = usage.current_month_dividends || 0;
  const minuteUsage = usage.current_month_minutes || 0;
  
  const dividendProgress = limits.isUnlimited ? 0 : (dividendUsage / limits.dividends) * 100;
  const minuteProgress = limits.isUnlimited ? 0 : (minuteUsage / limits.minutes) * 100;
  
  const dividendLimitReached = !limits.isUnlimited && dividendUsage >= limits.dividends;
  const minuteLimitReached = !limits.isUnlimited && minuteUsage >= limits.minutes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Usage Overview
          <Badge variant={limits.isUnlimited ? "default" : "secondary"}>
            {currentPlan || 'Trial'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track your monthly document generation limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dividend Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Dividend Vouchers</span>
            </div>
            <div className="flex items-center gap-2">
              {limits.isUnlimited ? (
                <Badge variant="default">Unlimited</Badge>
              ) : (
                <span className="text-sm font-medium">
                  {dividendUsage}/{limits.dividends}
                </span>
              )}
              {dividendLimitReached && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
          {!limits.isUnlimited && (
            <Progress value={dividendProgress} className="h-2" />
          )}
          {dividendLimitReached && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                You've reached your dividend limit for this month.
              </p>
            </div>
          )}
        </div>

        {/* Minutes Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="font-medium">Board Minutes</span>
            </div>
            <div className="flex items-center gap-2">
              {limits.isUnlimited ? (
                <Badge variant="default">Unlimited</Badge>
              ) : (
                <span className="text-sm font-medium">
                  {minuteUsage}/{limits.minutes}
                </span>
              )}
              {minuteLimitReached && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
          {!limits.isUnlimited && (
            <Progress value={minuteProgress} className="h-2" />
          )}
          {minuteLimitReached && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                You've reached your minutes limit for this month.
              </p>
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        {(dividendLimitReached || minuteLimitReached) && !limits.isUnlimited && (
          <div className="pt-4 border-t">
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Need more documents? Upgrade your plan for higher limits or unlimited access.
              </p>
              <Button onClick={openUpgradeCheckout} className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}

        {/* Next Reset Date */}
        {!limits.isUnlimited && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Limits reset on the 1st of each month
          </div>
        )}
      </CardContent>
    </Card>
  );
};
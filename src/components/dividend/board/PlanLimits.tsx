import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const getPlanLimits = (plan: string, userType: string) => {
  if (userType === 'accountant') {
    return { companies: Infinity, dividends: Infinity, minutes: Infinity };
  }
  switch (plan) {
    case 'professional':
      return { companies: 3, dividends: 10, minutes: 10 };
    case 'enterprise':
      return { companies: Infinity, dividends: Infinity, minutes: Infinity };
    default: // starter or trial
      return { companies: 1, dividends: 2, minutes: 2 };
  }
};

const formatResetDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });
};

export const PlanLimits = () => {
  const { data: usage } = useMonthlyUsage();
  const { userType } = useSubscriptionStatus();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!usage) return null;

  const limits = getPlanLimits(usage.plan, userType);
  const planName = usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1);
  const isEnterprise = usage.plan === 'enterprise' || userType === 'accountant';

  const formatUsage = (count: number, limit: number) => {
    if (limit === Infinity) return `${count} / ∞`;
    return `${count} / ${limit}`;
  };

  const getProgress = (count: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min((count / limit) * 100, 100);
  };

  const handleUpgradeSubscription = async () => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: 'price_1S1czXDQxPzFmGY0BNG13iVd' } // Professional plan monthly
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start upgrade process",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Plan: {planName}</h3>
        {!isEnterprise && (
          <Button 
            variant="outline"
            className="text-primary border-primary"
            onClick={handleUpgradeSubscription}
            disabled={isUpgrading}
          >
            {isUpgrading ? 'Processing...' : 'Upgrade Plan'}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Companies</span>
            <span className="text-sm font-medium">
              {formatUsage(usage.companiesCount, limits.companies)}
            </span>
          </div>
          <Progress 
            value={getProgress(usage.companiesCount, limits.companies)} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Dividend Vouchers</span>
            <span className="text-sm font-medium">
              {formatUsage(usage.dividendsCount, limits.dividends)}
            </span>
          </div>
          <Progress 
            value={getProgress(usage.dividendsCount, limits.dividends)}
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Board Minutes</span>
            <span className="text-sm font-medium">
              {formatUsage(usage.minutesCount, limits.minutes)}
            </span>
          </div>
          <Progress 
            value={getProgress(usage.minutesCount, limits.minutes)}
            className="h-2"
          />
        </div>
      </div>
      
      {usage.periodEnd && !isEnterprise && (
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          Resets on {formatResetDate(usage.periodEnd)}
        </div>
      )}
    </Card>
  );
};
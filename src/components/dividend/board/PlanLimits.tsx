import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";

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

const formatResetDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric' 
  });
};

export const PlanLimits = () => {
  const { data: usage } = useMonthlyUsage();

  if (!usage) return null;

  const limits = getPlanLimits(usage.plan);
  const planName = usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1);
  const isEnterprise = usage.plan === 'enterprise';

  const formatUsage = (count: number, limit: number) => {
    if (limit === Infinity) return `${count} / ∞`;
    return `${count} / ${limit}`;
  };

  const getProgress = (count: number, limit: number) => {
    if (limit === Infinity) return 0;
    return Math.min((count / limit) * 100, 100);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Plan: {planName}</h3>
        {!isEnterprise && (
          <Button 
            variant="outline"
            className="text-primary border-primary"
            onClick={() => window.location.href = '/pricing'}
          >
            Upgrade Plan
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
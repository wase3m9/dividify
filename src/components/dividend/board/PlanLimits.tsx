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

export const PlanLimits = () => {
  const { data: usage } = useMonthlyUsage();

  if (!usage) return null;

  const limits = getPlanLimits(usage.plan);
  const planName = usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Current Plan: {planName}</h3>
        {usage.plan !== 'enterprise' && (
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
              {usage.companiesCount} / {limits.companies === Infinity ? '∞' : limits.companies}
            </span>
          </div>
          <Progress 
            value={(usage.companiesCount / (limits.companies === Infinity ? 1 : limits.companies)) * 100} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Dividend Vouchers</span>
            <span className="text-sm font-medium">
              {usage.dividendsCount} / {limits.dividends === Infinity ? '∞' : limits.dividends}
            </span>
          </div>
          <Progress 
            value={(usage.dividendsCount / (limits.dividends === Infinity ? 1 : limits.dividends)) * 100}
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Board Minutes</span>
            <span className="text-sm font-medium">
              {usage.minutesCount} / {limits.minutes === Infinity ? '∞' : limits.minutes}
            </span>
          </div>
          <Progress 
            value={(usage.minutesCount / (limits.minutes === Infinity ? 1 : limits.minutes)) * 100}
            className="h-2"
          />
        </div>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CreditCard, Zap, Crown, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";

interface PlanRestrictionsProps {
  currentPlan: string;
  currentUsage: {
    companies: number;
    dividends: number;
    minutes: number;
  };
}

export const PlanRestrictions = ({ currentPlan, currentUsage }: PlanRestrictionsProps) => {
  const navigate = useNavigate();
  const { data: monthlyUsage } = useMonthlyUsage();

  const planLimits = {
    starter: { companies: 1, dividends: 2, minutes: 2 },
    trial: { companies: 1, dividends: 2, minutes: 2 },
    professional: { companies: 3, dividends: 10, minutes: 10 },
    enterprise: { companies: -1, dividends: -1, minutes: -1 } // Unlimited
  };

  const limits = planLimits[currentPlan as keyof typeof planLimits] || planLimits.starter;
  
  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'professional': return <Zap className="h-4 w-4" />;
      case 'enterprise': return <Crown className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const isLimitReached = (current: number, limit: number) => {
    return limit !== -1 && current >= limit;
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getPlanIcon(currentPlan)}
          <h3 className="font-semibold capitalize">{currentPlan} Plan</h3>
        </div>
        {currentPlan !== 'enterprise' && (
          <Button 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            Upgrade
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Companies</span>
          <span className={`text-sm font-medium ${
            isLimitReached(currentUsage.companies, limits.companies) ? 'text-red-600' : 'text-gray-900'
          }`}>
            {currentUsage.companies} / {formatLimit(limits.companies)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Monthly Dividends</span>
          <span className={`text-sm font-medium ${
            isLimitReached(currentUsage.dividends, limits.dividends) ? 'text-red-600' : 'text-gray-900'
          }`}>
            {currentUsage.dividends} / {formatLimit(limits.dividends)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Monthly Minutes</span>
          <span className={`text-sm font-medium ${
            isLimitReached(currentUsage.minutes, limits.minutes) ? 'text-red-600' : 'text-gray-900'
          }`}>
            {currentUsage.minutes} / {formatLimit(limits.minutes)}
          </span>
        </div>
      </div>

      {(isLimitReached(currentUsage.companies, limits.companies) ||
        isLimitReached(currentUsage.dividends, limits.dividends) ||
        isLimitReached(currentUsage.minutes, limits.minutes)) && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            You've reached some plan limits. Consider upgrading for more capacity.
          </p>
        </div>
      )}

      {monthlyUsage?.periodEnd && (
        <div className="mt-4 pt-3 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-help">
                  <Clock className="h-4 w-4" />
                  <span>Next reset: {new Date(monthlyUsage.periodEnd).toLocaleDateString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your usage limits will reset on this date</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </Card>
  );
};

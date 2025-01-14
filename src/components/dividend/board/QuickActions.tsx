import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const QuickActions = () => {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile-usage'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_plan, current_month_dividends, current_month_minutes')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!profile) throw new Error("Profile not found");

      return profile;
    }
  });

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'professional':
        return { dividends: 10, minutes: 10 };
      case 'enterprise':
        return { dividends: Infinity, minutes: Infinity };
      default: // starter or trial
        return { dividends: 2, minutes: 2 };
    }
  };

  const limits = profile ? getPlanLimits(profile.subscription_plan) : { dividends: 0, minutes: 0 };
  const isDividendsDisabled = profile?.current_month_dividends >= limits.dividends;
  const isMinutesDisabled = profile?.current_month_minutes >= limits.minutes;

  const renderButton = (
    onClick: () => void,
    icon: React.ReactNode,
    text: string,
    isDisabled: boolean,
    limitMessage: string
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onClick}
              disabled={isDisabled}
            >
              {icon}
              {text}
            </Button>
          </div>
        </TooltipTrigger>
        {isDisabled && (
          <TooltipContent>
            <p>{limitMessage}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {renderButton(
          () => navigate("/dividend-voucher"),
          <Plus className="mr-2 h-4 w-4" />,
          "Create Dividend Voucher",
          isDividendsDisabled,
          `You've reached your monthly limit of ${limits.dividends} dividend vouchers. This will reset at the start of your next billing cycle.`
        )}
        {renderButton(
          () => navigate("/board-minutes"),
          <FileText className="mr-2 h-4 w-4" />,
          "Create Board Minutes",
          isMinutesDisabled,
          `You've reached your monthly limit of ${limits.minutes} board minutes. This will reset at the start of your next billing cycle.`
        )}
      </div>
    </Card>
  );
};
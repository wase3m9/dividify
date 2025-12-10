import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileWarning, X } from "lucide-react";
import { useMissingBoardMinutes } from "@/hooks/useMissingBoardMinutes";

interface MissingBoardMinutesBannerProps {
  companyId?: string;
}

const DISMISS_STORAGE_KEY = 'missing-board-minutes-dismissed';
const DISMISS_DURATION_DAYS = 7;

export const MissingBoardMinutesBanner = ({ companyId }: MissingBoardMinutesBannerProps) => {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);
  const { data, isLoading } = useMissingBoardMinutes({ companyId });

  useEffect(() => {
    const dismissedTimestamp = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (dismissedTimestamp) {
      const dismissedDate = new Date(parseInt(dismissedTimestamp));
      const now = new Date();
      const daysSinceDismissed = Math.floor(
        (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceDismissed < DISMISS_DURATION_DAYS) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem(DISMISS_STORAGE_KEY);
      }
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, Date.now().toString());
    setIsDismissed(true);
  };

  const handleCreateMinutes = () => {
    navigate('/board-minutes-form');
  };

  // Don't show if loading, dismissed, or no missing dividends
  if (isLoading || isDismissed || !data || data.missingCount === 0) {
    return null;
  }

  const count = data.missingCount;
  const pluralizedText = count === 1 
    ? "1 dividend is missing board minutes" 
    : `${count} dividends are missing board minutes`;

  return (
    <Alert className="bg-amber-50 border-amber-200 relative">
      <FileWarning className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 font-semibold">
        {pluralizedText}
      </AlertTitle>
      <AlertDescription className="text-amber-700 mt-1">
        <p className="mb-3">
          Board minutes help ensure your dividend payments are properly documented and compliant with company law.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleCreateMinutes}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="sm"
          >
            Create Board Minutes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100"
          >
            Dismiss for now
          </Button>
        </div>
      </AlertDescription>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-amber-600 hover:text-amber-800"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
};

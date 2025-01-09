import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export const NavigationButtons = ({
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
      >
        {previousLabel}
      </Button>
      <Button
        type="submit"
        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
        onClick={onNext}
      >
        {nextLabel}
      </Button>
    </div>
  );
};
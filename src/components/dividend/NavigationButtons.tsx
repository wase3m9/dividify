import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  type?: "button" | "submit";
  submitText?: string;
}

export const NavigationButtons = ({
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
  type = "button",
  submitText
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
        type={type}
        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
        onClick={type === "button" ? onNext : undefined}
      >
        {submitText || nextLabel}
      </Button>
    </div>
  );
};
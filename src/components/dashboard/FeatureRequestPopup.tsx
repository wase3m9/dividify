import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lightbulb, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FeatureRequestPopup = () => {
  const [open, setOpen] = useState(false);
  const [featureRequest, setFeatureRequest] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!featureRequest.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please describe the feature you'd like to see.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("feature-request", {
        body: {
          featureRequest: featureRequest.trim(),
          additionalDetails: additionalDetails.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feature request has been submitted successfully.",
      });

      setFeatureRequest("");
      setAdditionalDetails("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting feature request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
            size="icon"
          >
            <Lightbulb className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-80 p-0"
          sideOffset={12}
        >
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Request a Feature</h3>
                <p className="text-sm text-muted-foreground">
                  Help us build Dividify better
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-request">What would you like to see?</Label>
              <Input
                id="feature-request"
                placeholder="Describe your feature idea..."
                value={featureRequest}
                onChange={(e) => setFeatureRequest(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-details">
                Tell us more about your idea (optional)
              </Label>
              <Textarea
                id="additional-details"
                placeholder="Any additional details..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

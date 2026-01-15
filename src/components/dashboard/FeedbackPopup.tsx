import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lightbulb, Send, X, HelpCircle, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FeedbackPopup = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"feature" | "support">("feature");
  
  // Feature request state
  const [featureRequest, setFeatureRequest] = useState("");
  const [featureDetails, setFeatureDetails] = useState("");
  
  // Support request state
  const [supportSubject, setSupportSubject] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFeatureSubmit = async (e: React.FormEvent) => {
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
          type: "feature",
          featureRequest: featureRequest.trim(),
          additionalDetails: featureDetails.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feature request has been submitted successfully.",
      });

      setFeatureRequest("");
      setFeatureDetails("");
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

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supportSubject.trim() || !supportMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in the subject and describe your issue.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("feature-request", {
        body: {
          type: "support",
          subject: supportSubject.trim(),
          email: supportEmail.trim(),
          message: supportMessage.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: "Support request sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setSupportSubject("");
      setSupportEmail("");
      setSupportMessage("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting support request:", error);
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
            <MessageSquare className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-96 p-0"
          sideOffset={12}
        >
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Get in Touch</h3>
                <p className="text-sm text-muted-foreground">
                  Request a feature or get support
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
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "feature" | "support")} className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
              <TabsTrigger value="feature" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Feature
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Support
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="feature" className="mt-0">
              <form onSubmit={handleFeatureSubmit} className="p-4 space-y-4">
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
                  <Label htmlFor="feature-details">
                    Tell us more (optional)
                  </Label>
                  <Textarea
                    id="feature-details"
                    placeholder="Any additional details..."
                    value={featureDetails}
                    onChange={(e) => setFeatureDetails(e.target.value)}
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
                      Submit Feature Request
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="support" className="mt-0">
              <form onSubmit={handleSupportSubmit} className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    placeholder="Brief description of your issue..."
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Your Email (optional)</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="your@email.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll use your account email if not provided
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-message">Describe your issue</Label>
                  <Textarea
                    id="support-message"
                    placeholder="Please describe the issue you're experiencing..."
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    rows={4}
                    required
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
                      Submit Support Request
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

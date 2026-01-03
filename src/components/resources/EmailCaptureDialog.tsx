import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceTitle: string;
  resourceDescription: string;
  pdfPath: string;
}

export const EmailCaptureDialog = ({
  open,
  onOpenChange,
  resourceTitle,
  resourceDescription,
  pdfPath,
}: EmailCaptureDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("resource-download", {
        body: {
          email,
          resourceName: resourceTitle,
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Check your email for confirmation!");
      
      // Trigger download
      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = pdfPath.split("/").pop() || "resource.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reset after delay
      setTimeout(() => {
        setIsSuccess(false);
        setEmail("");
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting email:", error);
      toast.error("Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download {resourceTitle}
          </DialogTitle>
          <DialogDescription>{resourceDescription}</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-center text-muted-foreground">
              Your download is starting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                We'll send you occasional updates about dividends and tax. Unsubscribe anytime.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Free PDF
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

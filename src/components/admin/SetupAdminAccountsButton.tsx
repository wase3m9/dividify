import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SetupAdminAccountsButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setupAdminAccounts = async () => {
    setIsLoading(true);
    try {
      console.log("Setting up admin accounts...");
      
      const { data, error } = await supabase.functions.invoke('setup-admin-accounts');

      if (error) {
        console.error("Error setting up admin accounts:", error);
        throw error;
      }

      console.log("Admin accounts setup response:", data);
      
      // Display results
      if (data?.results) {
        const successfulAccounts = data.results.filter((r: any) => r.success);
        const failedAccounts = data.results.filter((r: any) => !r.success);
        
        if (successfulAccounts.length > 0) {
          const passwords = successfulAccounts.map((acc: any) => 
            `${acc.email} (${acc.description}): ${acc.tempPassword}`
          ).join('\n');
          
          toast({
            title: "Admin Accounts Created Successfully",
            description: `Passwords:\n${passwords}`,
            duration: 15000, // Show for 15 seconds
          });
        }
        
        if (failedAccounts.length > 0) {
          const errors = failedAccounts.map((acc: any) => 
            `${acc.email}: ${acc.error}`
          ).join('\n');
          
          toast({
            variant: "destructive",
            title: "Some Accounts Failed",
            description: errors,
          });
        }
      }
    } catch (error: any) {
      console.error("Failed to setup admin accounts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to setup admin accounts",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={setupAdminAccounts} 
      disabled={isLoading}
      variant="destructive"
      className="mb-4"
    >
      {isLoading ? "Setting Up Admin Accounts..." : "Setup Admin Accounts (Dev Only)"}
    </Button>
  );
};
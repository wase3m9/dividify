import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CreateAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    setIsLoading(true);
    try {
      console.log("Calling create-admin function...");
      
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email: 'wase3m@hotmail.com' }
      });

      if (error) {
        console.error("Error creating admin:", error);
        throw error;
      }

      console.log("Admin creation response:", data);
      
      toast({
        title: "Success",
        description: `Admin user created successfully. Temporary password: ${data?.tempPassword}. Please change it immediately.`,
      });
    } catch (error: any) {
      console.error("Failed to create admin user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create admin user",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={createAdminUser} 
      disabled={isLoading}
      variant="outline"
      className="mb-4"
    >
      {isLoading ? "Creating Admin..." : "Create Admin User"}
    </Button>
  );
};
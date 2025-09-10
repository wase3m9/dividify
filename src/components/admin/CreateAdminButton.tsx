
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const CreateAdminButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    // Check if current user has admin privileges
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication required",
      });
      return;
    }

    // Check if user has admin role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Admin privileges required to create admin users",
      });
      return;
    }

    // Get admin details from user input (you may want to add a form for this)
    const email = prompt("Enter email for new admin user:");
    const fullName = prompt("Enter full name for new admin user:");
    const password = prompt("Enter password for new admin user (or leave blank for auto-generated):");

    if (!email || !fullName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email and full name are required",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Calling create-admin function...");
      
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: {
          email: email.trim(),
          full_name: fullName.trim(),
          password: password?.trim() || null
        }
      });

      if (error) {
        console.error("Error creating admin:", error);
        throw error;
      }

      console.log("Admin creation response:", data);
      
      toast({
        title: "Success",
        description: `Admin user created successfully for ${email}`,
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserPlus, Users } from "lucide-react";

export const AdminRoleManager = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const grantAdminRole = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current user first
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      // Grant admin role by calling the function
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: email.trim(), // This will need to be resolved to actual user ID
          role: 'admin',
          created_by: currentUser.id
        });

      if (roleError) {
        if (roleError.code === '23505') { // Unique constraint violation
          toast({
            variant: "destructive",
            title: "Error",
            description: "User already has admin role",
          });
        } else {
          throw roleError;
        }
        return;
      }

      // Log the action
      await supabase.rpc('log_admin_action', {
        action_type: 'admin_role_granted',
        target_user_id: email.trim(),
        details: { target_email: email.trim() }
      });

      toast({
        title: "Success",
        description: `Admin role granted to ${email}`,
      });
      
      setEmail("");
    } catch (error: any) {
      console.error("Failed to grant admin role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to grant admin role",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Role Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            onClick={grantAdminRole}
            disabled={isLoading}
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isLoading ? "Granting Admin Role..." : "Grant Admin Role"}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Only current admins can grant admin roles to other users
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
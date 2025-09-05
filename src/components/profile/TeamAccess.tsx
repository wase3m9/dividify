import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TeamAccessProps {
  userId: string;
}

export const TeamAccess = ({ userId }: TeamAccessProps) => {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  const { data: userProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, user_type')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isEligibleForTeamAccess = userProfile?.user_type === 'accountant' || 
    ['professional', 'enterprise', 'accountant'].includes(userProfile?.subscription_plan || '');

  const handleInvite = async () => {
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      // For now, just show a success message - this will be implemented when the database table is ready
      toast({
        title: "Feature Coming Soon",
        description: "Team access functionality will be available in a future update.",
      });

      setEmail("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsInviting(false);
    }
  };

  if (!isEligibleForTeamAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Access
          </CardTitle>
          <CardDescription>
            Invite team members to collaborate on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Team access is available with Professional, Enterprise, and Accountant plans</p>
            <p className="text-xs mt-2">Upgrade your subscription to invite team members</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Access
        </CardTitle>
        <CardDescription>
          Invite team members to access your dashboard and data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter team member's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleInvite}
                disabled={!email.trim() || isInviting}
              >
                <Plus className="h-4 w-4 mr-2" />
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Team Access Features (Coming Soon):</p>
          <ul className="space-y-1">
            <li>• Access to all company data and documents</li>
            <li>• Ability to create dividend vouchers and board minutes</li>
            <li>• View and download all generated documents</li>
            <li>• Shared usage limits under your subscription</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
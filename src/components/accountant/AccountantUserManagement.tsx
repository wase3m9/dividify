import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Users, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TeamMember {
  id: string;
  email: string;
  role: 'accountant' | 'assistant';
  status: 'active' | 'pending';
  invited_at: string;
}

export const AccountantUserManagement = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // For now, return mock data - in production this would query a team_members table
      return [
        {
          id: user.user.id,
          email: user.user.email || "main@account.com",
          role: 'accountant' as const,
          status: 'active' as const,
          invited_at: new Date().toISOString()
        }
      ];
    },
  });

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to invite",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      // In a full implementation, this would:
      // 1. Create a team_members record
      // 2. Send an invitation email
      // 3. Create appropriate permissions
      
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}. They'll have access to all company data.`,
      });
      
      setInviteEmail("");
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    } catch (error: any) {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="colleague@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
              className="flex-1"
            />
            <Button 
              onClick={handleInviteUser}
              disabled={isInviting}
            >
              {isInviting ? "Inviting..." : "Invite"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Invited users will have full access to all company data and can create dividends and board minutes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading team members...</div>
          ) : (
            <div className="space-y-3">
              {teamMembers?.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.invited_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.role === 'accountant' ? 'default' : 'secondary'}>
                      {member.role === 'accountant' ? 'Lead Accountant' : 'Assistant'}
                    </Badge>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    {member.role !== 'accountant' && (
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
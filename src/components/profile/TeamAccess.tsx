import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Mail, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  invited_at: string;
  accepted_at?: string;
}

interface TeamAccessProps {
  userId: string;
}

export const TeamAccess = ({ userId }: TeamAccessProps) => {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('inviter_id', userId);
      
      if (error) throw error;
      return data || [];
    },
  });

  const isEligibleForTeamAccess = userProfile?.user_type === 'accountant' || 
    ['professional', 'enterprise', 'accountant'].includes(userProfile?.subscription_plan);

  const handleInvite = async () => {
    if (!email.trim()) return;

    setIsInviting(true);
    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          inviter_id: userId,
          email: email.trim(),
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `Team invitation sent to ${email}`,
      });

      setEmail("");
      queryClient.invalidateQueries({ queryKey: ['team-members', userId] });
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

  const handleRemove = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: "Team member has been removed successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['team-members', userId] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
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

        {teamMembers.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Team Members ({teamMembers.length})</h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.accepted_at 
                          ? `Joined ${new Date(member.accepted_at).toLocaleDateString()}`
                          : `Invited ${new Date(member.invited_at).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.accepted_at 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.accepted_at ? 'Active' : 'Pending'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(member.id)}
                      className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Team Access Features:</p>
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
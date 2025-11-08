import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Mail, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamAccessProps {
  userId: string;
}

interface TeamInvitation {
  id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  role: 'member' | 'admin';
  created_at: string;
  expires_at: string;
}

interface TeamMember {
  id: string;
  member_id: string;
  role: 'member' | 'admin';
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

export const TeamAccess = ({ userId }: TeamAccessProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<'member' | 'admin'>('member');
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

  const { data: invitations, isLoading: invitationsLoading } = useQuery({
    queryKey: ['team-invitations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('inviter_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TeamInvitation[];
    },
    enabled: !!userId,
  });

  const { data: teamMembers, isLoading: membersLoading } = useQuery({
    queryKey: ['team-members', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, member_id, role, created_at')
        .eq('owner_id', userId);
      
      if (error) throw error;
      if (!data) return [];
      
      // Get profile and email for each member
      const membersWithDetails = await Promise.all(
        data.map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', member.member_id)
            .single();
          
          const { data: userData } = await supabase.auth.admin.getUserById(member.member_id);
          
          return {
            ...member,
            profiles: {
              full_name: profile?.full_name || 'Unknown',
              email: userData?.user?.email || 'N/A'
            }
          };
        })
      );
      
      return membersWithDetails as TeamMember[];
    },
    enabled: !!userId,
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'member' | 'admin' }) => {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          inviter_id: userId,
          invitee_email: email.toLowerCase().trim(),
          role,
          status: 'pending'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations', userId] });
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send invitation",
      });
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-invitations', userId] });
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members', userId] });
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully.",
      });
    },
  });

  const isEligibleForTeamAccess = userProfile?.user_type === 'accountant' || 
    ['professional', 'enterprise', 'accountant'].includes(userProfile?.subscription_plan || '');

  const handleInvite = () => {
    if (!email.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    inviteMutation.mutate({ email, role });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          Invite team members to access your dashboard and collaborate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Form */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInvite()}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleInvite}
                disabled={!email.trim() || inviteMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {inviteMutation.isPending ? 'Sending...' : 'Invite'}
              </Button>
            </div>
          </div>
        </div>

        {/* Active Team Members */}
        {!membersLoading && teamMembers && teamMembers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Team Members</h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.profiles?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{member.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will revoke {member.profiles?.full_name}'s access to your dashboard and data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeMemberMutation.mutate(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invitations */}
        {!invitationsLoading && invitations && invitations.filter(i => i.status === 'pending').length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Pending Invitations</h4>
            <div className="space-y-2">
              {invitations
                .filter(inv => inv.status === 'pending')
                .map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{invitation.invitee_email}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent {new Date(invitation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(invitation.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => cancelInvitationMutation.mutate(invitation.id)}
                        disabled={cancelInvitationMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Team Access Permissions:</p>
          <ul className="space-y-1">
            <li>• <strong>Members</strong> can view and create documents for shared companies</li>
            <li>• <strong>Admins</strong> have full access to manage companies and team members</li>
            <li>• All team activity counts toward your subscription limits</li>
            <li>• Invitations expire after 7 days if not accepted</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
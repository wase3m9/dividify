import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Mail, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";

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

  // Fetch sent invitations
  const { data: invitations = [], isLoading: invitationsLoading } = useQuery({
    queryKey: ['team-invitations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('inviter_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Fetch team members
  const { data: teamMembers = [], isLoading: membersLoading } = useQuery({
    queryKey: ['team-members', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const isEligibleForTeamAccess = userProfile?.user_type === 'accountant' || 
    ['professional', 'enterprise', 'accountant'].includes(userProfile?.subscription_plan || '');

  const handleInvite = async () => {
    if (!email.trim()) return;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setIsInviting(true);
    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          inviter_id: userId,
          invitee_email: email.toLowerCase().trim(),
          role: 'member',
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            variant: "destructive",
            title: "Invitation Already Sent",
            description: "An invitation has already been sent to this email address.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Invitation Sent",
          description: `An invitation has been sent to ${email}`,
        });
        setEmail("");
        queryClient.invalidateQueries({ queryKey: ['team-invitations', userId] });
      }
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

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Cancelled",
        description: "The invitation has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ['team-invitations', userId] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "The team member has been removed.",
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle2 className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
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
          Invite team members to access your dashboard and data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invitation Form */}
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

        {/* Active Team Members */}
        {teamMembers.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Active Team Members</h4>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Member ID: {member.member_id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this team member? They will lose access to your account immediately.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Invitations */}
        {invitations.filter(inv => inv.status === 'pending').length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Pending Invitations</h4>
            <div className="space-y-2">
              {invitations
                .filter(inv => inv.status === 'pending')
                .map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{invitation.invitee_email}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent {new Date(invitation.created_at).toLocaleDateString()} • Expires {new Date(invitation.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(invitation.status)}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this invitation? The recipient will no longer be able to accept it.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No, Keep It</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleCancelInvitation(invitation.id)}>
                              Yes, Cancel
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

        {/* Past Invitations */}
        {invitations.filter(inv => ['accepted', 'rejected', 'cancelled'].includes(inv.status)).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Past Invitations</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {invitations
                .filter(inv => ['accepted', 'rejected', 'cancelled'].includes(inv.status))
                .map((invitation) => (
                  <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{invitation.invitee_email}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent {new Date(invitation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(invitation.status)}
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
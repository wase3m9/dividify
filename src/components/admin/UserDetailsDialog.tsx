import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  useUserDetails, 
  useUserCompanies, 
  useUserActivity,
  useExtendTrial,
  useUpdateUserProfile 
} from "@/hooks/useUserManagement";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, Building2, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserEventTimeline } from "./UserEventTimeline";

interface UserDetailsDialogProps {
  userId: string | null;
  onClose: () => void;
}

export const UserDetailsDialog = ({ userId, onClose }: UserDetailsDialogProps) => {
  const { data: user, isLoading: userLoading } = useUserDetails(userId);
  const { data: companies, isLoading: companiesLoading } = useUserCompanies(userId);
  const { data: activity, isLoading: activityLoading } = useUserActivity(userId);
  const extendTrial = useExtendTrial();
  const updateProfile = useUpdateUserProfile();

  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("");
  const [trialDays, setTrialDays] = useState(30);

  const handleSaveProfile = () => {
    if (!userId) return;
    updateProfile.mutate({
      userId,
      fullName: fullName || undefined,
      userType: userType || undefined,
    });
    setEditMode(false);
  };

  const handleExtendTrial = () => {
    if (!userId) return;
    extendTrial.mutate({ userId, days: trialDays });
  };

  if (!userId) return null;

  return (
    <Dialog open={!!userId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        {userLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : user ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>
                    Member since {format(new Date(user.created_at), 'PPP')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={user.full_name || "Enter name"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>User Type</Label>
                        <Select value={userType} onValueChange={setUserType}>
                          <SelectTrigger>
                            <SelectValue placeholder={user.user_type} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="accountant">Accountant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Email</Label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Full Name</Label>
                          <p className="font-medium">{user.full_name || 'Not set'}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">User Type</Label>
                          <div>
                            {user.user_type === 'accountant' ? (
                              <Badge variant="default">Accountant</Badge>
                            ) : (
                              <Badge variant="outline">Individual</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Documents This Month</Label>
                          <p className="font-medium">
                            {user.current_month_dividends} dividends, {user.current_month_minutes} minutes
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => {
                        setEditMode(true);
                        setFullName(user.full_name || "");
                        setUserType(user.user_type);
                      }}>
                        Edit Profile
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Plan</Label>
                      <p className="font-medium capitalize">{user.subscription_plan}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <div>
                        {user.subscription_status === 'active' ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : user.subscription_plan === 'trial' ? (
                          <Badge variant="secondary">Trial</Badge>
                        ) : (
                          <Badge variant="outline">None</Badge>
                        )}
                      </div>
                    </div>
                    {user.current_period_end && (
                      <div>
                        <Label className="text-muted-foreground">Period End</Label>
                        <p className="font-medium">
                          {format(new Date(user.current_period_end), 'PPP')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground">Extend Trial</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="number"
                        value={trialDays}
                        onChange={(e) => setTrialDays(parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Button onClick={handleExtendTrial}>
                        Extend by {trialDays} days
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="companies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Companies ({companies?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {companiesLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : companies && companies.length > 0 ? (
                    <div className="space-y-2">
                      {companies.map((company) => (
                        <div key={company.id} className="flex items-center gap-2 p-3 border rounded-lg">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {company.registration_number || 'No reg number'}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No companies registered</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : activity && activity.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {activity.map((log) => (
                        <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">{log.description}</p>
                            <p className="text-sm text-muted-foreground">{log.action}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activity recorded</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <UserEventTimeline userId={userId} />
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center text-muted-foreground">User not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

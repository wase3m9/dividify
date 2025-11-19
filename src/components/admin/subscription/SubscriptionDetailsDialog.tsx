import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubscriptionDetails, useSubscriptionActions } from "@/hooks/useSubscriptionManagement";
import { ExternalLink, Ban, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SubscriptionDetailsDialogProps {
  subscriptionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionDetailsDialog = ({ subscriptionId, open, onOpenChange }: SubscriptionDetailsDialogProps) => {
  const { data: details, isLoading } = useSubscriptionDetails(subscriptionId || undefined);
  const { cancelSubscription, reactivateSubscription } = useSubscriptionActions();
  const [cancelReason, setCancelReason] = useState("");
  const [extendDays, setExtendDays] = useState("30");

  const handleCancel = () => {
    if (subscriptionId) {
      cancelSubscription.mutate({ subscriptionId, reason: cancelReason });
      onOpenChange(false);
      setCancelReason("");
    }
  };

  const handleReactivate = () => {
    if (subscriptionId) {
      reactivateSubscription.mutate({ subscriptionId, extendDays: parseInt(extendDays) });
      onOpenChange(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'trialing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'past_due': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : details ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="user">User Info</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Plan</Label>
                  <div className="font-medium capitalize">{details.plan_code}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div>
                    <Badge variant="outline" className={getStatusColor(details.status)}>
                      {details.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Monthly Amount</Label>
                  <div className="font-medium text-lg">${details.monthly_amount}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Period End</Label>
                  <div className="font-medium">
                    {format(new Date(details.current_period_end), 'MMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <div className="font-medium">
                    {format(new Date(details.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Companies</Label>
                  <div className="font-medium">{details.company_count}</div>
                </div>
              </div>

              {details.stripe_customer_id && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://dashboard.stripe.com/customers/${details.stripe_customer_id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Stripe Dashboard
                </Button>
              )}
            </TabsContent>

            <TabsContent value="user" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="font-medium">{details.full_name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-medium">{details.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">User Type</Label>
                  <div className="font-medium capitalize">{details.user_type}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Companies</Label>
                  <div className="font-medium">{details.company_count}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dividends This Month</Label>
                  <div className="font-medium">{details.current_month_dividends}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Minutes This Month</Label>
                  <div className="font-medium">{details.current_month_minutes}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              {details.status === 'active' || details.status === 'trialing' || details.status === 'past_due' ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Cancel Subscription</h3>
                  <div className="space-y-2">
                    <Label htmlFor="cancel-reason">Cancellation Reason (Optional)</Label>
                    <Textarea
                      id="cancel-reason"
                      placeholder="Reason for cancellation..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Ban className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel the user's subscription and set their plan to trial. This action cannot be undone automatically.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Confirm Cancellation</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : details.status === 'canceled' ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Reactivate Subscription</h3>
                  <div className="space-y-2">
                    <Label htmlFor="extend-days">Extend Period (Days)</Label>
                    <Input
                      id="extend-days"
                      type="number"
                      min="1"
                      value={extendDays}
                      onChange={(e) => setExtendDays(e.target.value)}
                    />
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reactivate Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reactivate subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reactivate the subscription and extend the period by {extendDays} days.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReactivate}>Confirm Reactivation</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

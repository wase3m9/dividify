import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, CreditCard } from "lucide-react";
import { BrandingUploader } from "@/components/profile/BrandingUploader";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
      return user;
    },
    retry: false,
  });

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, subscription_plan, created_at, logo_url')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
      });
    }
  }, [profile]);

  const calculateTrialDaysLeft = () => {
    if (!profile?.created_at || profile.subscription_plan !== 'trial') return null;
    
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysLeft = 7 - daysSinceCreation; // Changed from 14 to 7 days
    
    return Math.max(0, daysLeft);
  };

  const trialDaysLeft = calculateTrialDaysLeft();
  const isTrialExpired = trialDaysLeft === 0 && profile?.subscription_plan === 'trial';

  const handleSave = async () => {
    if (isTrialExpired) {
      toast({
        variant: "destructive",
        title: "Trial Expired",
        description: "Please upgrade your subscription to continue using the service",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
        })
        .eq('id', user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleUpgradeSubscription = async (priceId: string) => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start upgrade process",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
          
          {/* Trial Status Card */}
          {profile?.subscription_plan === 'trial' && (
            <Card className="p-6 mb-6 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-800">Trial Status</h3>
              </div>
              
              {trialDaysLeft > 0 ? (
                <div>
                  <p className="text-orange-700 mb-4">
                    You have <span className="font-bold">{trialDaysLeft} days</span> left in your free trial.
                  </p>
                   <Button 
                     onClick={() => handleUpgradeSubscription('price_1QTr3QP5i3F4Z8xZuDHGNLzS')}
                     disabled={isUpgrading}
                     className="bg-orange-600 hover:bg-orange-700 text-white"
                   >
                     <CreditCard className="mr-2 h-4 w-4" />
                     {isUpgrading ? 'Processing...' : 'Upgrade Now'}
                   </Button>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 font-semibold mb-4">
                    Your trial has expired. Please upgrade to continue using the service.
                  </p>
                   <Button 
                     onClick={() => handleUpgradeSubscription('price_1QTr3QP5i3F4Z8xZuDHGNLzS')}
                     disabled={isUpgrading}
                     className="bg-red-600 hover:bg-red-700 text-white"
                   >
                     <CreditCard className="mr-2 h-4 w-4" />
                     {isUpgrading ? 'Processing...' : 'Upgrade Required'}
                   </Button>
                </div>
              )}
            </Card>
          )}

          <div className="space-y-6">
            {/* Profile Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="block text-left mb-2">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    disabled={isTrialExpired}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="block text-left mb-2">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-left">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="plan" className="block text-left mb-2">Subscription Plan</Label>
                  <Input
                    id="plan"
                    value={profile?.subscription_plan || 'trial'}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <Button 
                  onClick={handleSave} 
                  className="w-full"
                  disabled={isTrialExpired}
                >
                  {isTrialExpired ? 'Trial Expired - Upgrade Required' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Custom Branding Section */}
            <BrandingUploader 
              userId={user?.id || ''} 
              currentLogoUrl={profile?.logo_url}
            />

            {/* Upgrade Plans Section */}
            {(!profile?.subscription_plan || profile.subscription_plan === 'trial') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Choose Your Plan
                  </CardTitle>
                  <CardDescription>
                    Select the plan that best fits your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Starter Plan */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Starter</h3>
                      <p className="text-2xl font-bold">£4<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Up to 2 Dividend Vouchers</li>
                        <li>• Up to 2 Board Minutes</li>
                        <li>• Basic templates</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription('price_1QTr2mP5i3F4Z8xZyNQJBjhD')}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>

                    {/* Professional Plan */}
                    <div className="p-4 border-2 border-primary rounded-lg relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary">Popular</Badge>
                      </div>
                      <h3 className="font-semibold text-lg">Professional</h3>
                      <p className="text-2xl font-bold">£12<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Up to 10 Dividend Vouchers</li>
                        <li>• Up to 10 Board Minutes</li>
                        <li>• Custom branding</li>
                        <li>• Premium templates</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription('price_1QTr3QP5i3F4Z8xZuDHGNLzS')}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Enterprise</h3>
                      <p className="text-2xl font-bold">£29<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Unlimited documents</li>
                        <li>• Custom branding</li>
                        <li>• Premium templates</li>
                        <li>• Priority support</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription('price_1QTr4AP5i3F4Z8xZK8b2tLmX')}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>
                  </div>

                  {/* Accountant Plan */}
                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-green-900">Accountant Plan</h3>
                        <p className="text-2xl font-bold text-green-900">£20<span className="text-sm font-normal">/month</span></p>
                        <p className="text-sm text-green-700 mt-1">Perfect for accounting professionals managing multiple clients</p>
                      </div>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpgradeSubscription('price_1QTr4sP5i3F4Z8xZvBpQMbRz')}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

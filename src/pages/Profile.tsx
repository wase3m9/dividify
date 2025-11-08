import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, CreditCard, Check, RefreshCw, Loader2, Crown } from "lucide-react";
import { BrandingUploader } from "@/components/profile/BrandingUploader";
import { TeamAccess } from "@/components/profile/TeamAccess";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { RecentActivityProfile } from "@/components/profile/RecentActivityProfile";
import { useMonthlyUsage } from "@/hooks/useMonthlyUsage";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshSubscriptionStatus, isLoading: subscriptionLoading } = useSubscriptionStatus();
  const { data: monthlyUsage } = useMonthlyUsage();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const priceMap = {
    starter: { monthly: 'price_1S1d26DQxPzFmGY056CeyPNE', yearly: 'price_1S1d26DQxPzFmGY056CeyPNE' },
    professional: { monthly: 'price_1S1czXDQxPzFmGY0BNG13iVd', yearly: 'price_1S1d1PDQxPzFmGY0UNNWf8bW' },
    enterprise: { monthly: 'price_1S1cmEDQxPzFmGY0PEEAQmpr', yearly: 'price_1S1cwCDQxPzFmGY0vqjzr51R' },
    accountant: { monthly: 'price_1QiOntDQxPzFmGY0u6RQ4C0f', yearly: 'price_1S1ctdDQxPzFmGY0iyYLKRXp' },
  } as const;
  const getPriceId = (plan: keyof typeof priceMap) => priceMap[plan][billingCycle];

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

  // Open plan selection modal when arriving from pricing with query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openPlans') === '1') {
      setShowPlanSelection(true);
    }
    // Handle success parameter from URL and refresh subscription
    if (params.get('success') === '1') {
      toast({
        title: "Success",
        description: "Subscription updated successfully!",
      });
      // Refresh subscription status after successful payment
      refreshSubscriptionStatus();
      // Remove the success parameter from URL
      navigate('/profile', { replace: true });
    }
  }, [navigate, refreshSubscriptionStatus, toast]);

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

  const handleUpgradeSubscription = async (priceId?: string) => {
    if (!priceId) {
      setShowPlanSelection(true);
      return;
    }
    
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
        setShowPlanSelection(false);
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
                     onClick={() => handleUpgradeSubscription()}
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
                     onClick={() => handleUpgradeSubscription()}
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
                  <div className="flex gap-2">
                    <Input
                      id="plan"
                      value={profile?.subscription_plan || 'trial'}
                      disabled
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={refreshSubscriptionStatus}
                      disabled={subscriptionLoading}
                      className="px-3"
                      title="Refresh subscription status"
                    >
                      {subscriptionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
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

            {/* Plan Usage Card - Moved from Dashboard */}
            {profile?.subscription_plan && profile.subscription_plan !== 'trial' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-[#9b87f5]" />
                    {profile.subscription_plan === 'starter' && 'Starter Plan'}
                    {profile.subscription_plan === 'professional' && 'Professional Plan'}
                    {profile.subscription_plan === 'enterprise' && 'Enterprise Plan'}
                    {profile.subscription_plan === 'accountant' && 'Accountant Plan'}
                  </CardTitle>
                  <CardDescription>Your current usage and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Companies</span>
                      <span className="font-medium">
                        {monthlyUsage?.companiesCount || 0} / {
                          profile.subscription_plan === 'starter' ? '1' :
                          profile.subscription_plan === 'professional' ? '3' :
                          'Unlimited'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Dividends</span>
                      <span className="font-medium">
                        {monthlyUsage?.dividendsCount || 0} / {
                          profile.subscription_plan === 'starter' ? '2' :
                          profile.subscription_plan === 'professional' ? '10' :
                          'Unlimited'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Minutes</span>
                      <span className="font-medium">
                        {monthlyUsage?.minutesCount || 0} / {
                          profile.subscription_plan === 'starter' ? '2' :
                          profile.subscription_plan === 'professional' ? '10' :
                          'Unlimited'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Next reset: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Branding Section */}
            <BrandingUploader 
              userId={user?.id || ''} 
              currentLogoUrl={profile?.logo_url}
            />

            {/* Team Access Section */}
            <TeamAccess userId={user?.id || ''} />

            {/* Recent Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and documents</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivityProfile userId={user?.id || ''} />
              </CardContent>
            </Card>

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
                      <p className="text-2xl font-bold">£6<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Up to 2 Dividend Vouchers</li>
                        <li>• Up to 2 Board Minutes</li>
                        <li>• Basic templates</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription(getPriceId('starter'))}
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
                      <p className="text-2xl font-bold">£15<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Up to 10 Dividend Vouchers</li>
                        <li>• Up to 10 Board Minutes</li>
                        <li>• Custom branding</li>
                        <li>• Premium templates</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription(getPriceId('professional'))}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg">Enterprise</h3>
                      <p className="text-2xl font-bold">£24<span className="text-sm font-normal">/month</span></p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Unlimited documents</li>
                        <li>• Custom branding</li>
                        <li>• Premium templates</li>
                        <li>• Priority support</li>
                      </ul>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => handleUpgradeSubscription(getPriceId('enterprise'))}
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
                        <p className="text-2xl font-bold text-green-900">£30<span className="text-sm font-normal">/month</span></p>
                        <p className="text-sm text-green-700 mt-1">Perfect for accounting professionals managing multiple clients</p>
                      </div>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpgradeSubscription(getPriceId('accountant'))}
                        disabled={isUpgrading}
                      >
                        {isUpgrading ? 'Processing...' : 'Subscribe'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plan Selection Modal */}
            {showPlanSelection && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-lg border p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-center">Choose Your Plan</h2>
                      <p className="text-muted-foreground text-center">Select the plan that best fits your needs</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowPlanSelection(false)}
                      className="ml-4"
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="mb-6 flex items-center justify-center gap-2">
                    <Button variant={billingCycle === 'monthly' ? 'default' : 'outline'} size="sm" onClick={() => setBillingCycle('monthly')}>Monthly</Button>
                    <Button variant={billingCycle === 'yearly' ? 'default' : 'outline'} size="sm" onClick={() => setBillingCycle('yearly')}>Yearly (save 20%)</Button>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3 mb-6">
                    {/* Starter Plan */}
                    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <h3 className="text-lg font-semibold mb-2">Starter</h3>
                      <div className="text-3xl font-bold mb-4">
                        £{billingCycle === 'monthly' ? '6' : Math.round(6 * 12 * 0.8 / 12).toString()}
                        <span className="text-base font-normal">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                        {billingCycle === 'yearly' && <div className="text-sm text-muted-foreground">Billed £{Math.round(6 * 12 * 0.8)} yearly</div>}
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Up to 2 Dividend Vouchers
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Up to 2 Board Minutes
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Basic templates
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleUpgradeSubscription(getPriceId('starter'))}
                        disabled={isUpgrading}
                        variant="outline" 
                        className="w-full"
                      >
                        Subscribe
                      </Button>
                    </div>

                    {/* Professional Plan */}
                    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                          Popular
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Professional</h3>
                      <div className="text-3xl font-bold mb-4">
                        £{billingCycle === 'monthly' ? '15' : Math.round(15 * 12 * 0.8 / 12).toString()}
                        <span className="text-base font-normal">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                        {billingCycle === 'yearly' && <div className="text-sm text-muted-foreground">Billed £{Math.round(15 * 12 * 0.8)} yearly</div>}
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Up to 10 Dividend Vouchers
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Up to 10 Board Minutes
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Custom branding
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Premium templates
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleUpgradeSubscription(getPriceId('professional'))}
                        disabled={isUpgrading}
                        className="w-full"
                      >
                        Subscribe
                      </Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
                      <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
                      <div className="text-3xl font-bold mb-4">
                        £{billingCycle === 'monthly' ? '24' : Math.round(24 * 12 * 0.8 / 12).toString()}
                        <span className="text-base font-normal">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                        {billingCycle === 'yearly' && <div className="text-sm text-muted-foreground">Billed £{Math.round(24 * 12 * 0.8)} yearly</div>}
                      </div>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Unlimited documents
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Custom branding
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Premium templates
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          Priority support
                        </li>
                      </ul>
                      <Button 
                        onClick={() => handleUpgradeSubscription(getPriceId('enterprise'))}
                        disabled={isUpgrading}
                        variant="outline" 
                        className="w-full"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>

                  {/* Accountants/Agents Plan - Centered */}
                  <div className="flex justify-center">
                    <div className="border rounded-lg p-6 hover:border-primary/50 transition-colors bg-green-50 border-green-200 max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-2 text-green-800 text-center">Accountants/Agents</h3>
                      <div className="text-3xl font-bold mb-4 text-green-800 text-center">
                        £{billingCycle === 'monthly' ? '30' : Math.round(30 * 12 * 0.8 / 12).toString()}
                        <span className="text-base font-normal">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                        {billingCycle === 'yearly' && <div className="text-sm text-muted-foreground">Billed £{Math.round(30 * 12 * 0.8)} yearly</div>}
                      </div>
                      <p className="text-green-700 text-sm mb-4 text-center">Perfect for accounting professionals managing multiple clients</p>
                      <Button 
                        onClick={() => handleUpgradeSubscription(getPriceId('accountant'))}
                        disabled={isUpgrading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

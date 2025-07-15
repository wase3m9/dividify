
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, CreditCard } from "lucide-react";

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
        .select('full_name, subscription_plan, created_at')
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
    const daysLeft = 14 - daysSinceCreation;
    
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

  const handleUpgradeSubscription = async () => {
    if (isUpgrading) return;
    
    setIsUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          priceId: 'price_1QTr2mP5i3F4Z8xZyNQJBjhD' // Default starter plan
        }
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
                    onClick={handleUpgradeSubscription}
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
                    onClick={handleUpgradeSubscription}
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

          <Card className="p-6">
            <div className="space-y-6">
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
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;

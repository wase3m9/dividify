import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { FileText, Download, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleSubscribe = async (plan: 'starter' | 'professional' | 'enterprise') => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-24 px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Personal Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Your Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="phone">Telephone Number</Label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" placeholder="Your job title" />
                </div>
                <Button className="w-full">Save Changes</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Last login: {new Date().toLocaleDateString()}
                </div>
              </div>
            </Card>
          </div>

          {/* Center Column - Current Plan & Billing */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg capitalize">{profile?.subscription_plan || 'Trial'}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {profile?.trial_expired ? 'Trial expired' : 'Trial active'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Usage This Month</h4>
                  <p className="text-sm">Dividend Vouchers: {profile?.current_month_dividends || 0}</p>
                  <p className="text-sm">Board Minutes: {profile?.current_month_minutes || 0}</p>
                  <p className="text-sm">Companies: {profile?.companies_count || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
              <div className="space-y-4">
                {profile?.subscription_plan === 'trial' && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Professional</h3>
                        <p className="text-sm text-gray-600">£12/month</p>
                      </div>
                      <Button 
                        onClick={() => handleSubscribe('professional')}
                        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                      >
                        Upgrade <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {(profile?.subscription_plan === 'trial' || profile?.subscription_plan === 'professional') && (
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Enterprise</h3>
                        <p className="text-sm text-gray-600">£29/month</p>
                      </div>
                      <Button 
                        onClick={() => handleSubscribe('enterprise')}
                        className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                      >
                        Upgrade <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Billing History */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Billing History</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">March 2024</h4>
                      <p className="text-sm text-gray-600">Professional Plan</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

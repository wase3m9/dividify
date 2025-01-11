import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Briefcase, History, CreditCard, Clock, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserProfile {
  email: string;
  name: string | null;
  phone: string | null;
  jobTitle: string | null;
}

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  planName: string;
  downloadUrl: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("loading...");
  const [isEditing, setIsEditing] = useState(false);
  const [loginHistory] = useState([
    { date: new Date() },
    { date: new Date(Date.now() - 86400000) },
  ]);
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: new Date(Date.now() - 2592000000), // 30 days ago
      amount: 12,
      planName: "Professional Plan",
      downloadUrl: "#"
    }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile({
        email: user.email || "",
        name: profileData?.username || null,
        phone: null,
        jobTitle: null,
      });

      setSubscriptionPlan(profileData?.subscription_plan || "trial");
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username: profile.name })
      .eq('id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "Please try again later",
      });
      return;
    }

    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved",
    });
  };

  const handleUpgrade = async (plan: 'professional' | 'enterprise') => {
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
      });
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const getNextTier = (currentPlan: string) => {
    switch (currentPlan) {
      case 'trial':
        return { name: 'Starter', price: '£3' };
      case 'starter':
        return { name: 'Professional', price: '£12' };
      case 'professional':
        return { name: 'Enterprise', price: '£29' };
      default:
        return null;
    }
  };

  const nextTier = getNextTier(subscriptionPlan);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Details */}
          <div className="md:col-span-2 space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Details</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input value={profile.email} disabled />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telephone Number
                  </Label>
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Title
                  </Label>
                  <Input
                    value={profile.jobTitle || ""}
                    onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Billing Settings
              </h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Plan */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                    <p className="text-gray-600 capitalize mb-1">{subscriptionPlan}</p>
                    {subscriptionPlan === 'trial' && (
                      <p className="text-sm text-gray-500">7 days free trial</p>
                    )}
                  </div>

                  {/* Available Plans */}
                  {nextTier && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                      <Button 
                        variant="outline"
                        className="w-full mb-4 h-auto py-4 border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white"
                        onClick={() => handleUpgrade(nextTier.name.toLowerCase() as 'professional' | 'enterprise')}
                      >
                        <div className="text-left">
                          <div className="font-semibold">Upgrade to {nextTier.name}</div>
                          <div className="text-sm">
                            {nextTier.price}/month - Unlock more features
                          </div>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                  {invoices.length > 0 ? (
                    <div className="space-y-4">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.planName}</p>
                            <p className="text-sm text-gray-500">
                              {format(invoice.date, 'dd MMM yyyy')} - £{invoice.amount}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No invoices available</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <History className="h-6 w-6" />
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {loginHistory.map((login, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Logged in</p>
                      <p className="text-sm text-gray-500">
                        {format(login.date, "PPp")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

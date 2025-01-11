import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Briefcase, History, CreditCard, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserProfile {
  email: string;
  name: string | null;
  phone: string | null;
  jobTitle: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("loading...");
  const [isEditing, setIsEditing] = useState(false);
  const [loginHistory] = useState([
    { date: new Date(), ip: "192.168.1.1" },
    { date: new Date(Date.now() - 86400000), ip: "192.168.1.1" }, // Yesterday
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

  if (!profile) {
    return <div>Loading...</div>;
  }

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
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
                  <p className="text-gray-600 capitalize">{subscriptionPlan}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4"
                      onClick={() => window.location.href = "/#pricing"}
                    >
                      <div className="text-left">
                        <div className="font-semibold">Upgrade Plan</div>
                        <div className="text-sm text-gray-500">View available plans</div>
                      </div>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Billing History</h3>
                  <p className="text-gray-600">No invoices available</p>
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
                      <p className="text-sm text-gray-500">
                        IP: {login.ip}
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
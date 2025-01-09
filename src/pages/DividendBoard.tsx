import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Building2, Users, Share2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  registered_address: string | null;
}

interface Director {
  id: string;
  full_name: string;
  position: string | null;
}

interface Shareholding {
  id: string;
  shareholder_name: string;
  share_class: string;
  number_of_shares: number;
}

const DividendBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [shareholdings, setShareholdings] = useState<Shareholding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        fetchData();
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch directors
      const { data: directorsData, error: directorsError } = await supabase
        .from('directors')
        .select('*')
        .order('created_at', { ascending: false });

      if (directorsError) throw directorsError;
      setDirectors(directorsData);

      // Fetch shareholdings
      const { data: shareholdingsData, error: shareholdingsError } = await supabase
        .from('shareholdings')
        .select('*')
        .order('created_at', { ascending: false });

      if (shareholdingsError) throw shareholdingsError;
      setShareholdings(shareholdingsData);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dividend Board</h1>
            <p className="text-gray-600">
              Manage your company information, directors, shareholdings, and dividend vouchers in one place.
            </p>
          </div>

          {/* Company Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#9b87f5]" />
                <h2 className="text-xl font-semibold">Company Information</h2>
              </div>
              {!company && (
                <Button 
                  variant="outline"
                  className="text-[#9b87f5] border-[#9b87f5]"
                >
                  Add Company
                </Button>
              )}
            </div>
            {company ? (
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {company.name}</p>
                <p><span className="font-medium">Registration Number:</span> {company.registration_number}</p>
                <p><span className="font-medium">Registered Address:</span> {company.registered_address}</p>
              </div>
            ) : (
              <p className="text-gray-500">No company information added yet.</p>
            )}
          </Card>

          {/* Directors */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#9b87f5]" />
                <h2 className="text-xl font-semibold">Directors</h2>
              </div>
              <Button 
                variant="outline"
                className="text-[#9b87f5] border-[#9b87f5]"
              >
                Add Director
              </Button>
            </div>
            {directors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directors.map((director) => (
                    <TableRow key={director.id}>
                      <TableCell>{director.full_name}</TableCell>
                      <TableCell>{director.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No directors added yet.</p>
            )}
          </Card>

          {/* Shareholdings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[#9b87f5]" />
                <h2 className="text-xl font-semibold">Shareholdings</h2>
              </div>
              <Button 
                variant="outline"
                className="text-[#9b87f5] border-[#9b87f5]"
              >
                Add Shareholding
              </Button>
            </div>
            {shareholdings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shareholder</TableHead>
                    <TableHead>Share Class</TableHead>
                    <TableHead>Number of Shares</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shareholdings.map((shareholding) => (
                    <TableRow key={shareholding.id}>
                      <TableCell>{shareholding.shareholder_name}</TableCell>
                      <TableCell>{shareholding.share_class}</TableCell>
                      <TableCell>{shareholding.number_of_shares}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No shareholdings added yet.</p>
            )}
          </Card>

          {/* Quick Actions */}
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="flex-1 p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Dividend Vouchers</h3>
                </div>
                <p className="text-gray-600">
                  Create and manage dividend vouchers for shareholders.
                </p>
                <Button 
                  className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  onClick={() => navigate("/dividend-voucher/create")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Voucher
                </Button>
              </div>
            </Card>

            <Card className="flex-1 p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Board Minutes</h3>
                </div>
                <p className="text-gray-600">
                  Record and store board meeting minutes for dividend declarations.
                </p>
                <Button className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Minutes
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Activity Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      id: 1,
                      action: "Dividend Voucher Created",
                      date: "2024-04-10",
                      type: "voucher",
                    },
                    {
                      id: 2,
                      action: "Board Minutes Submitted",
                      date: "2024-04-09",
                      type: "minutes",
                    },
                    {
                      id: 3,
                      action: "Dividend Voucher Created",
                      date: "2024-04-08",
                      type: "voucher",
                    },
                  ].map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {activity.type === "voucher" ? (
                            <FileText className="h-4 w-4 text-[#9b87f5]" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-[#9b87f5]" />
                          )}
                          {activity.action}
                        </div>
                      </TableCell>
                      <TableCell>{activity.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendBoard;
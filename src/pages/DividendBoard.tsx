import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DividendBoard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  // Sample recent activity data - this would typically come from your backend
  const recentActivity = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dividend Board</h1>
            <p className="text-gray-600">
              Manage your dividend vouchers and board meeting minutes in one place.
            </p>
          </div>

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
                  {recentActivity.map((activity) => (
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
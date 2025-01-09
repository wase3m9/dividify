import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, DollarSign } from "lucide-react";
import { Navigation } from "@/components/Navigation";

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
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Dividend Vouchers</h3>
                </div>
                <p className="text-gray-600">
                  Create and manage dividend vouchers for shareholders.
                </p>
                <Button className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Voucher
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-[#9b87f5]" />
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
        </div>
      </div>
    </div>
  );
};

export default DividendBoard;
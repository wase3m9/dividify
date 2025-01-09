import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const DividendVoucherForm = () => {
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
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Dividend Voucher</h1>
            <p className="text-gray-600">
              Enter the dividend details to generate a voucher.
            </p>
          </div>

          {/* Form */}
          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shareClass">Share class</Label>
                  <Input
                    id="shareClass"
                    placeholder="Ordinary £1.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Select description"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="paymentDate">Payment date</Label>
                    <div className="relative mt-1">
                      <Input
                        id="paymentDate"
                        type="date"
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="holdingDate">Holding date</Label>
                    <div className="relative mt-1">
                      <Input
                        id="holdingDate"
                        type="date"
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="financialYear">Financial year ending</Label>
                  <div className="relative mt-1">
                    <Input
                      id="financialYear"
                      type="date"
                      className="pl-10"
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dividend-board")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                >
                  Next
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendVoucherForm;
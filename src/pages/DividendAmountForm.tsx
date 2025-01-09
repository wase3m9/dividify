import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DividendAmountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shareholderName, shareClass, shareholdings } = location.state || {};

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    navigate("/dividend-voucher/waivers", {
      state: {
        shareholderName,
        shareClass,
        shareholdings,
        amountPerShare: formData.get('amountPerShare'),
        totalAmount: formData.get('totalAmount')
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Dividend Amount"
            description="Enter the dividend amount details."
            progress={50}
          />

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Currency of dividend</Label>
                  <Select defaultValue="GBP">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">£ - GB Pound</SelectItem>
                      <SelectItem value="USD">$ - US Dollar</SelectItem>
                      <SelectItem value="EUR">€ - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amountPerShare">Net amount payable per share</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5">£</span>
                    <Input
                      id="amountPerShare"
                      name="amountPerShare"
                      type="number"
                      step="0.01"
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="totalAmount">Total dividend payable</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5">£</span>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      step="0.01"
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <NavigationButtons
                onPrevious={() => navigate("/dividend-voucher/create")}
                onNext={() => {}} // This will be handled by the form submission
              />
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendAmountForm;
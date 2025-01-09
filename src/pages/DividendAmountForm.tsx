import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    const amountPerShare = (e.target as HTMLFormElement).amountPerShare.value;
    const totalAmount = (e.target as HTMLFormElement).totalAmount.value;
    
    navigate("/dividend-voucher/waivers", {
      state: {
        shareholderName,
        shareClass,
        shareholdings,
        amountPerShare,
        totalAmount
      }
    });
  };

  const currencies = [
    { code: "GBP", symbol: "£", name: "GB Pound" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
    { code: "AUD", symbol: "$", name: "Australian Dollar" },
    { code: "CAD", symbol: "$", name: "Canadian Dollar" },
    { code: "HKD", symbol: "$", name: "Hong Kong Dollar" },
    { code: "SGD", symbol: "$", name: "Singapore Dollar" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dividend Amount</h1>
            <p className="text-gray-600">
              Enter the dividend amount details.
            </p>
          </div>

          {/* Form */}
          <Card className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shareClass">Share class</Label>
                  <Input
                    id="shareClass"
                    value={shareClass || "Ordinary £1.00"}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency of dividend</Label>
                  <Select defaultValue="GBP">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} - {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-700">
                  Please enter either the amount of dividend payable per share or the total dividend payable for the class of share selected.
                </div>

                <div>
                  <Label htmlFor="amountPerShare">Net amount payable per share</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5">£</span>
                    <Input
                      id="amountPerShare"
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
                      type="number"
                      step="0.01"
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dividend-voucher/create")}
                >
                  Previous
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

export default DividendAmountForm;
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DividendWaivers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSummary, setShowSummary] = useState(false);
  const { shareholderName, shareClass, shareholdings, amountPerShare, totalAmount } = location.state || {};

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
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Dividend payable on {shareClass} shares
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shareholder</TableHead>
                      <TableHead>Voucher number</TableHead>
                      <TableHead>Holding</TableHead>
                      <TableHead>Dividend payable</TableHead>
                      <TableHead>Amount per share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{shareholderName}</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>{shareholdings}</TableCell>
                      <TableCell>£{totalAmount}</TableCell>
                      <TableCell>£{amountPerShare}</TableCell>
                    </TableRow>
                    <TableRow className="font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{shareholdings}</TableCell>
                      <TableCell>£{totalAmount}</TableCell>
                      <TableCell>£{amountPerShare}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSummary(false)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => navigate("/dividend-board")}
                >
                  Next
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Dividend Waivers</h1>
            <p className="text-gray-600">
              Specify if any shareholders have elected to waive dividends.
            </p>
          </div>

          {/* Form */}
          <Card className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <p className="text-base font-medium mb-4">
                    Have any of the shareholders due to receive a dividend elected to waive dividends?
                  </p>
                  <RadioGroup defaultValue="no" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dividend-voucher/amount")}
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

export default DividendWaivers;
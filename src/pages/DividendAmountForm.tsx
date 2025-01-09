import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DividendAmountFormValues {
  currency: string;
  amountPerShare: string;
  totalAmount: string;
}

const DividendAmountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shareholderName, shareClass, shareholdings } = location.state || {};

  const form = useForm<DividendAmountFormValues>({
    defaultValues: {
      currency: "GBP",
      amountPerShare: "",
      totalAmount: ""
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const onSubmit = (data: DividendAmountFormValues) => {
    navigate("/dividend-voucher/waivers", {
      state: {
        shareholderName,
        shareClass,
        shareholdings,
        amountPerShare: data.amountPerShare,
        totalAmount: data.totalAmount,
        currency: data.currency
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency of dividend</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GBP">£ - GB Pound</SelectItem>
                            <SelectItem value="USD">$ - US Dollar</SelectItem>
                            <SelectItem value="EUR">€ - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amountPerShare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Net amount payable per share</FormLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">£</span>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className="pl-7"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total dividend payable</FormLabel>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">£</span>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className="pl-7"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <NavigationButtons
                  onPrevious={() => navigate("/dividend-voucher/create")}
                  type="submit"
                />
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendAmountForm;
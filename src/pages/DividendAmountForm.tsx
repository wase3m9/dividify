import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { CurrencyField } from "@/components/dividend/amount/CurrencyField";
import { AmountFields } from "@/components/dividend/amount/AmountFields";
import { formSchema, DividendAmountFormValues } from "@/components/dividend/amount/types";

const DividendAmountForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shareholderName, shareClass, shareholderAddress } = location.state || {};
  const { toast } = useToast();

  console.log("Location state in DividendAmountForm:", location.state); // Debug log

  const form = useForm<DividendAmountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "GBP",
      amountPerShare: "",
      totalAmount: "",
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
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    navigate("/dividend-voucher/waivers", {
      state: {
        shareholderName,
        shareClass,
        shareholderAddress, // Make sure we pass the shareholder address forward
        amountPerShare: data.amountPerShare,
        totalAmount: data.totalAmount,
        currency: data.currency,
        paymentDate: data.paymentDate, // Pass the payment date
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
                  <CurrencyField form={form} />
                  <AmountFields form={form} />
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
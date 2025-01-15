import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { NavigationButtons } from "../NavigationButtons";
import { useToast } from "@/hooks/use-toast";
import { CurrencyField } from "./CurrencyField";
import { AmountFields } from "./AmountFields";
import { formSchema, DividendAmountFormValues } from "./types";

interface AmountFormProps {
  onSubmit: (data: DividendAmountFormValues) => void;
  onPrevious: () => void;
  initialData?: DividendAmountFormValues;
}

export const AmountForm = ({ onSubmit, onPrevious, initialData }: AmountFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<DividendAmountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      currency: "GBP",
      amountPerShare: "",
      totalAmount: "",
      paymentDate: "",
    }
  });

  const handleSubmit = (data: DividendAmountFormValues) => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <CurrencyField form={form} />
          <AmountFields form={form} />
        </div>

        <NavigationButtons
          onPrevious={onPrevious}
          type="submit"
        />
      </form>
    </Form>
  );
};
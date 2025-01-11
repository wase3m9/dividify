import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BoardMinutesDetailsFormProps {
  onPrevious: () => void;
}

interface Director {
  name: string;
}

interface FormData {
  meetingDate: string;
  meetingAddress: string;
  directors: Director[];
  paymentDate: string;
  amount: number;
  shareClassName: string;
  nominalValue: number;
  financialYearEnd: string;
}

export const BoardMinutesDetailsForm: FC<BoardMinutesDetailsFormProps> = ({
  onPrevious,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [directors, setDirectors] = useState<Director[]>([{ name: "" }]);
  const form = useForm<FormData>();

  const addDirector = () => {
    if (directors.length < 5) {
      setDirectors([...directors, { name: "" }]);
    } else {
      toast({
        variant: "destructive",
        title: "Maximum limit reached",
        description: "You can only add up to 5 officers.",
      });
    }
  };

  const removeDirector = (index: number) => {
    const newDirectors = [...directors];
    newDirectors.splice(index, 1);
    setDirectors(newDirectors);
  };

  const updateDirector = (index: number, name: string) => {
    const newDirectors = [...directors];
    newDirectors[index] = { name };
    setDirectors(newDirectors);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .limit(1)
        .single();

      if (!companyData) throw new Error("No company found");

      const { error: insertError } = await supabase
        .from('minutes')
        .insert([{
          title: `Board Minutes - ${new Date(data.meetingDate).toLocaleDateString()}`,
          meeting_date: data.meetingDate,
          company_id: companyData.id,
          user_id: user.id,
        }]);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Board minutes created successfully",
      });

      navigate("/dividend-board");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="meetingDate"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Date Held</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingAddress"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Meeting Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter the meeting address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-left">Present Officers</label>
          {directors.map((director, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Officer ${index + 1} name`}
                value={director.name}
                onChange={(e) => updateDirector(index, e.target.value)}
              />
              {directors.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeDirector(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addDirector}>
            Add Another Officer
          </Button>
        </div>

        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Date Dividend to be Paid</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareClassName"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Share Class Name</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select share class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ordinary">Ordinary share</SelectItem>
                  <SelectItem value="Preference">Preference share</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominalValue"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Nominal Value</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financialYearEnd"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Financial Year End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <NavigationButtons
          onPrevious={onPrevious}
          submitText="Create Minutes"
          type="submit"
        />
      </form>
    </Form>
  );
};
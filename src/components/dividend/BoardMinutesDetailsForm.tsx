
import { FC, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useCompanyData } from "@/hooks/useCompanyData";
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
  dividendType: string;
  nominalValue: number;
  financialYearEnd: string;
}

interface BoardMinutesDetailsFormProps {
  selectedCompanyId?: string;
}

export const BoardMinutesDetailsForm: FC<BoardMinutesDetailsFormProps> = ({ selectedCompanyId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedCompany, directors, shareholders } = useCompanyData(selectedCompanyId);
  const [formDirectors, setFormDirectors] = useState<Director[]>([{ name: "" }]);
  const form = useForm<FormData>();

  // Pre-populate form with company data
  useEffect(() => {
    if (selectedCompany) {
      // Pre-populate meeting address with company registered address
      form.setValue("meetingAddress", selectedCompany.registered_address || "");
    }
  }, [selectedCompany, form]);

  // Pre-populate directors from existing company directors
  useEffect(() => {
    if (directors && directors.length > 0) {
      const directorNames = directors.map(director => ({
        name: `${director.title} ${director.forenames} ${director.surname}`.trim()
      }));
      setFormDirectors(directorNames);
    }
  }, [directors]);

  const addDirector = () => {
    if (formDirectors.length < 5) {
      setFormDirectors([...formDirectors, { name: "" }]);
    } else {
      toast({
        variant: "destructive",
        title: "Maximum limit reached",
        description: "You can only add up to 5 officers.",
      });
    }
  };

  const removeDirector = (index: number) => {
    const newDirectors = [...formDirectors];
    newDirectors.splice(index, 1);
    setFormDirectors(newDirectors);
  };

  const updateDirector = (index: number, name: string) => {
    const newDirectors = [...formDirectors];
    newDirectors[index] = { name };
    setFormDirectors(newDirectors);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedCompanyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a company first",
      });
      return;
    }

    navigate("/board-minutes/preview", {
      state: {
        ...data,
        directors: formDirectors,
        companyId: selectedCompanyId,
        companyName: selectedCompany?.name,
        companyAddress: selectedCompany?.registered_address,
        companyRegistrationNumber: selectedCompany?.registration_number,
      }
    });
  };

  const handleCancel = () => {
    navigate("/dividend-board");
  };

  // Get available share classes from existing shareholders
  const availableShareClasses = shareholders ? 
    Array.from(new Set(shareholders.map(s => s.share_class))) : [];

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
          {formDirectors.map((director, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Officer ${index + 1} name`}
                value={director.name}
                onChange={(e) => updateDirector(index, e.target.value)}
              />
              {formDirectors.length > 1 && (
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
          <div className="text-left">
            <Button type="button" variant="outline" onClick={addDirector}>
              Add Another Officer
            </Button>
          </div>
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
                  {availableShareClasses.map((shareClass) => (
                    <SelectItem key={shareClass} value={shareClass}>
                      {shareClass}
                    </SelectItem>
                  ))}
                  {availableShareClasses.length === 0 && (
                    <>
                      <SelectItem value="Ordinary">Ordinary share</SelectItem>
                      <SelectItem value="Preference">Preference share</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dividendType"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-left">Dividend Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dividend type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Interim">Interim Dividend</SelectItem>
                  <SelectItem value="Final">Final Dividend</SelectItem>
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

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#9b87f5] hover:bg-[#8b77e5]"
          >
            Create Minutes
          </Button>
        </div>
      </form>
    </Form>
  );
};

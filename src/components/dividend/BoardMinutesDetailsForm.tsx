import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NavigationButtons } from "@/components/dividend/NavigationButtons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface BoardMinutesDetailsFormProps {
  onPrevious: () => void;
}

interface FormData {
  title: string;
  meetingDate: string;
  minutesFile: FileList;
}

export const BoardMinutesDetailsForm: FC<BoardMinutesDetailsFormProps> = ({
  onPrevious,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormData>();

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

      const file = data.minutesFile[0];
      const filePath = `minutes/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase
        .storage
        .from('minutes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('minutes')
        .insert([{
          title: data.title,
          meeting_date: data.meetingDate,
          file_path: filePath,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the title of the meeting" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minutesFile"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Upload Minutes</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => onChange(e.target.files)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <NavigationButtons
          onPrevious={onPrevious}
          submitText="Create Minutes"
        />
      </form>
    </Form>
  );
};
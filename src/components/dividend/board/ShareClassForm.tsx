import { FC } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface ShareClassFormProps {
  onSubmit: (data: { shareClass: string; numberOfShares: string; numberOfHolders: string }) => void;
  onCancel: () => void;
  initialData?: {
    shareClass: string;
    numberOfShares: string;
    numberOfHolders: string;
  };
}

export const ShareClassForm: FC<ShareClassFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const form = useForm({
    defaultValues: {
      shareClass: initialData?.shareClass || "",
      numberOfShares: initialData?.numberOfShares || "",
      numberOfHolders: initialData?.numberOfHolders || ""
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="shareClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select share class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Ordinary">Ordinary</SelectItem>
                  <SelectItem value="Preference">Preference</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfShares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Shares</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfHolders"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Holders</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};
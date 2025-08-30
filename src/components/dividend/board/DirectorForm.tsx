import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const directorFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  forenames: z.string().min(1, "Forename(s) is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  address: z.string().min(1, "Address is required"),
  position: z.string().optional(),
  date_of_appointment: z.string().min(1, "Date of appointment is required")
});

type DirectorFormValues = z.infer<typeof directorFormSchema>;

interface DirectorFormProps {
  onSubmit: (data: DirectorFormValues) => void;
  isLoading?: boolean;
  initialData?: {
    title: string;
    forenames: string;
    surname: string;
    email: string;
    address: string;
    position?: string;
    date_of_appointment: string;
  } | null;
}

export const DirectorForm: FC<DirectorFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const form = useForm<DirectorFormValues>({
    resolver: zodResolver(directorFormSchema),
    defaultValues: initialData || {
      title: "",
      forenames: "",
      surname: "",
      email: "",
      address: "",
      position: "",
      date_of_appointment: new Date().toISOString().split('T')[0]
    }
  });

  const handleSubmit = async (data: DirectorFormValues) => {
    await onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Officer' : 'Add New Officer'}</DialogTitle>
        <DialogDescription>
          {initialData ? 'Edit officer details.' : 'Add a new officer to your company. Fill in all required fields.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr">Mr</SelectItem>
                      <SelectItem value="Mrs">Mrs</SelectItem>
                      <SelectItem value="Miss">Miss</SelectItem>
                      <SelectItem value="Ms">Ms</SelectItem>
                      <SelectItem value="Dr">Dr</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="forenames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forename(s)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_appointment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Appointment</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Officer" : "Add Officer")}
          </Button>
        </form>
      </Form>
    </>
  );
};
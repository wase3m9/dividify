import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useScheduledDividends, CreateScheduleInput, RecurringDividend } from "@/hooks/useScheduledDividends";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const scheduleSchema = z.object({
  shareholder_id: z.string().min(1, "Please select a shareholder"),
  share_class: z.string().min(1, "Share class is required"),
  number_of_shares: z.number().min(1, "Number of shares must be at least 1"),
  amount_per_share: z.number().min(0.01, "Amount must be at least £0.01"),
  total_amount: z.number().min(0.01, "Total must be at least £0.01"),
  frequency: z.enum(["monthly", "quarterly", "annually"]),
  day_of_month: z.number().min(1).max(28),
  start_date: z.date(),
  end_date: z.date().optional().nullable(),
  email_recipients: z.array(z.string().email()),
  include_board_minutes: z.boolean(),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface CreateScheduleDialogProps {
  companyId: string;
  trigger?: React.ReactNode;
  editingSchedule?: RecurringDividend | null;
  onClose?: () => void;
}

export function CreateScheduleDialog({
  companyId,
  trigger,
  editingSchedule,
  onClose,
}: CreateScheduleDialogProps) {
  const [open, setOpen] = useState(!!editingSchedule);
  const [emailInput, setEmailInput] = useState("");
  const { createSchedule, updateSchedule } = useScheduledDividends(companyId);

  // Fetch shareholders for this company
  const { data: shareholders } = useQuery({
    queryKey: ['shareholders', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shareholders')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_share_class', false);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      shareholder_id: "",
      share_class: "",
      number_of_shares: 1,
      amount_per_share: 0,
      total_amount: 0,
      frequency: "monthly",
      day_of_month: 28,
      start_date: addDays(new Date(), 7),
      end_date: null,
      email_recipients: [],
      include_board_minutes: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingSchedule) {
      form.reset({
        shareholder_id: editingSchedule.shareholder_id,
        share_class: editingSchedule.share_class,
        number_of_shares: editingSchedule.number_of_shares,
        amount_per_share: editingSchedule.amount_per_share,
        total_amount: editingSchedule.total_amount,
        frequency: editingSchedule.frequency,
        day_of_month: editingSchedule.day_of_month,
        start_date: new Date(editingSchedule.start_date),
        end_date: editingSchedule.end_date ? new Date(editingSchedule.end_date) : null,
        email_recipients: editingSchedule.email_recipients,
        include_board_minutes: editingSchedule.include_board_minutes,
      });
      setOpen(true);
    }
  }, [editingSchedule, form]);

  // Auto-calculate total when shares or amount changes
  const watchShares = form.watch("number_of_shares");
  const watchAmountPerShare = form.watch("amount_per_share");

  useEffect(() => {
    const total = watchShares * watchAmountPerShare;
    form.setValue("total_amount", Math.round(total * 100) / 100);
  }, [watchShares, watchAmountPerShare, form]);

  // Auto-fill share class and shares when shareholder selected
  const watchShareholder = form.watch("shareholder_id");
  useEffect(() => {
    if (watchShareholder && shareholders) {
      const sh = shareholders.find((s) => s.id === watchShareholder);
      if (sh) {
        form.setValue("share_class", sh.share_class);
        form.setValue("number_of_shares", sh.number_of_shares);
      }
    }
  }, [watchShareholder, shareholders, form]);

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const current = form.getValues("email_recipients");
      if (!current.includes(email)) {
        form.setValue("email_recipients", [...current, email]);
      }
      setEmailInput("");
    }
  };

  const removeEmail = (email: string) => {
    const current = form.getValues("email_recipients");
    form.setValue("email_recipients", current.filter((e) => e !== email));
  };

  const onSubmit = async (values: ScheduleFormValues) => {
    const input: CreateScheduleInput = {
      company_id: companyId,
      shareholder_id: values.shareholder_id,
      share_class: values.share_class,
      number_of_shares: values.number_of_shares,
      amount_per_share: values.amount_per_share,
      total_amount: values.total_amount,
      frequency: values.frequency,
      day_of_month: values.day_of_month,
      start_date: format(values.start_date, 'yyyy-MM-dd'),
      end_date: values.end_date ? format(values.end_date, 'yyyy-MM-dd') : null,
      email_recipients: values.email_recipients,
      include_board_minutes: values.include_board_minutes,
    };

    if (editingSchedule) {
      await updateSchedule.mutateAsync({
        id: editingSchedule.id,
        ...input,
      });
    } else {
      await createSchedule.mutateAsync(input);
    }

    setOpen(false);
    onClose?.();
    form.reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSchedule ? "Edit Recurring Dividend" : "Create Recurring Dividend"}
          </DialogTitle>
          <DialogDescription>
            Set up automatic dividend vouchers and board minutes that are generated and emailed on a schedule.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Shareholder Selection */}
            <FormField
              control={form.control}
              name="shareholder_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shareholder</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shareholder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {shareholders?.map((sh) => (
                        <SelectItem key={sh.id} value={sh.id}>
                          {sh.shareholder_name || sh.share_class} ({sh.number_of_shares} shares)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Configuration */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="number_of_shares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shares</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount_per_share"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>£ per Share</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="font-semibold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="day_of_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of Month</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Max 28th to avoid month-end issues</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "No end date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < form.getValues("start_date")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Recipients */}
            <FormField
              control={form.control}
              name="email_recipients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Recipients</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Add email address"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addEmail}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((email) => (
                      <Badge key={email} variant="secondary" className="gap-1">
                        {email}
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormDescription>
                    Documents will be emailed to these addresses when generated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Board Minutes Toggle */}
            <FormField
              control={form.control}
              name="include_board_minutes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Board Minutes</FormLabel>
                    <FormDescription>
                      Automatically generate board minutes alongside the dividend voucher
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSchedule.isPending || updateSchedule.isPending}
              >
                {createSchedule.isPending || updateSchedule.isPending
                  ? "Saving..."
                  : editingSchedule
                  ? "Update Schedule"
                  : "Create Schedule"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

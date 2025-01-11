import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CompanySelectorProps {
  onSelect: (companyId: string) => void;
  selectedCompanyId?: string;
}

export const CompanySelector = ({ onSelect, selectedCompanyId }: CompanySelectorProps) => {
  const { toast } = useToast();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch companies",
        });
        throw error;
      }
      
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading companies...</div>;
  }

  return (
    <Select onValueChange={onSelect} defaultValue={selectedCompanyId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a company" />
      </SelectTrigger>
      <SelectContent>
        {companies?.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
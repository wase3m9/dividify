import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DirectorForm } from "./DirectorForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Director {
  id: string;
  computed_full_name: string | null;
  position: string | null;
  address: string;
  date_of_appointment: string;
  company_id: string;
}

interface DirectorsSectionProps {
  directors: Director[];
}

export const DirectorsSection: FC<DirectorsSectionProps> = ({ directors }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Check if we've reached the limit
      if (directors.length >= 10) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Maximum number of officers (10) reached",
        });
        return;
      }

      // Compute the full name
      const fullName = `${data.title} ${data.forenames} ${data.surname}`.trim();

      // Get the company ID from the first director (assuming all directors belong to the same company)
      let companyId = directors[0]?.company_id;
      
      if (!companyId) {
        // If no company ID is available from directors, try to get it from the companies table
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (companyError) throw companyError;
        if (!companyData) throw new Error("No company found");
        
        companyId = companyData.id;
      }

      const { error } = await supabase.from('officers').insert([{
        ...data,
        full_name: fullName,
        user_id: user.id,
        company_id: companyId
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Officer added successfully",
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Officers ({directors.length}/10)</h2>
        </div>
        <Button 
          variant="outline"
          className="text-[#9b87f5] border-[#9b87f5]"
          onClick={() => setIsDialogOpen(true)}
          disabled={directors.length >= 10}
        >
          Add Officer
        </Button>
      </div>
      {directors.length > 0 ? (
        <div className="space-y-2">
          {directors.map((director) => (
            <div key={director.id} className="p-4 border rounded-lg">
              <p><span className="font-medium">Name:</span> {director.computed_full_name}</p>
              {director.position && <p><span className="font-medium">Position:</span> {director.position}</p>}
              <p><span className="font-medium">Address:</span> {director.address}</p>
              <p><span className="font-medium">Date of Appointment:</span> {new Date(director.date_of_appointment).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No officers added yet.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DirectorForm onSubmit={handleSubmit} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
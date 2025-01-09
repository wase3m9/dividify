import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { DirectorForm } from "./DirectorForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Director {
  id: string;
  computed_full_name: string | null;
  position: string | null;
  email: string;
  address: string;
  waive_dividend: boolean;
  date_of_appointment: string;
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
      const { error } = await supabase.from('directors').insert([{
        ...data,
        company_id: directors[0]?.company_id // Assuming all directors belong to the same company
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
          <h2 className="text-xl font-semibold">Officers</h2>
        </div>
        <Button 
          variant="outline"
          className="text-[#9b87f5] border-[#9b87f5]"
          onClick={() => setIsDialogOpen(true)}
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
              <p><span className="font-medium">Email:</span> {director.email}</p>
              <p><span className="font-medium">Address:</span> {director.address}</p>
              <p><span className="font-medium">Waives Dividend:</span> {director.waive_dividend ? "Yes" : "No"}</p>
              <p><span className="font-medium">Date of Appointment:</span> {new Date(director.date_of_appointment).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No officers added yet.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DirectorForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Dialog>
    </Card>
  );
};
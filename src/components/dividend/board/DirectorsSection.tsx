import { FC, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
  title: string;
  forenames: string;
  surname: string;
  email: string;
}

interface DirectorsSectionProps {
  directors: Director[];
}

export const DirectorsSection: FC<DirectorsSectionProps> = ({ directors: initialDirectors }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [directors, setDirectors] = useState<Director[]>(initialDirectors);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const { toast } = useToast();

  const fetchDirectors = useCallback(async (companyId: string) => {
    const { data, error } = await supabase
      .from('officers')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) {
      console.error('Error fetching directors:', error);
      return;
    }
    
    if (data) {
      setDirectors(data);
    }
  }, []);

  const handleDelete = async (directorId: string) => {
    try {
      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', directorId);

      if (error) throw error;

      setDirectors(directors.filter(director => director.id !== directorId));
      
      toast({
        title: "Success",
        description: "Officer deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleEdit = (director: Director) => {
    setEditingDirector(director);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Check if we've reached the limit (only for new officers)
      if (!editingDirector && directors.length >= 10) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Maximum number of officers (10) reached",
        });
        return;
      }

      // Compute the full name
      const fullName = `${data.title} ${data.forenames} ${data.surname}`.trim();

      // Get the company ID from the first director
      let companyId = directors[0]?.company_id;
      
      if (!companyId) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (companyError) throw companyError;
        if (!companyData) throw new Error("No company found");
        
        companyId = companyData.id;
      }

      if (editingDirector) {
        // Update existing officer
        const { error } = await supabase
          .from('officers')
          .update({
            ...data,
            computed_full_name: fullName,
          })
          .eq('id', editingDirector.id);

        if (error) throw error;
      } else {
        // Insert new officer
        const { error } = await supabase
          .from('officers')
          .insert([{
            ...data,
            computed_full_name: fullName,
            user_id: user.id,
            company_id: companyId
          }]);

        if (error) throw error;
      }

      // Fetch updated directors list
      await fetchDirectors(companyId);

      toast({
        title: "Success",
        description: editingDirector ? "Officer updated successfully" : "Officer added successfully",
      });
      setIsDialogOpen(false);
      setEditingDirector(null);
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
          onClick={() => {
            setEditingDirector(null);
            setIsDialogOpen(true);
          }}
          disabled={directors.length >= 10}
        >
          Add Officer
        </Button>
      </div>
      {directors.length > 0 ? (
        <div className="space-y-2">
          {directors.map((director) => (
            <div key={director.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-gray-500">Name:</div>
                  <div>{director.computed_full_name}</div>
                  
                  {director.position && (
                    <>
                      <div className="text-gray-500">Position:</div>
                      <div>{director.position}</div>
                    </>
                  )}
                  
                  <div className="text-gray-500">Address:</div>
                  <div>{director.address}</div>
                  
                  <div className="text-gray-500">Date of Appointment:</div>
                  <div>{new Date(director.date_of_appointment).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(director)}
                    className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(director.id)}
                    className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No officers added yet.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            {editingDirector ? 'Edit Officer' : 'Add Officer'}
          </DialogTitle>
          <DirectorForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            initialData={editingDirector}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
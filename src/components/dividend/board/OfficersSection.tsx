import { FC, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Trash2, Edit, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DirectorForm } from "./DirectorForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OfficersAutoFill } from "../company/OfficersAutoFill";

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

interface OfficersSectionProps {
  directors: Director[];
  companyRegistrationNumber?: string;
  companyId?: string;
}

export const OfficersSection: FC<OfficersSectionProps> = ({ 
  directors: initialDirectors, 
  companyRegistrationNumber,
  companyId 
}) => {
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

      // Get the company ID from the first director or from URL params
      let companyId = directors[0]?.company_id;
      
      if (!companyId) {
        // Try to get company ID from URL params first
        const urlParams = new URLSearchParams(window.location.search);
        const selectedCompanyId = urlParams.get('companyId') || sessionStorage.getItem('selectedCompanyId');
        
        if (selectedCompanyId) {
          companyId = selectedCompanyId;
        } else {
          // Fallback to first company
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

          if (companyError) throw companyError;
          if (!companyData) throw new Error("No company found");
          
          companyId = companyData.id;
        }
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

  const handleOfficersImported = () => {
    // Refresh the directors list after import
    if (companyId) {
      fetchDirectors(companyId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Companies House Auto-Fill */}
      {companyRegistrationNumber && companyId && (
        <OfficersAutoFill 
          companyNumber={companyRegistrationNumber}
          companyId={companyId}
          onOfficersImported={handleOfficersImported}
        />
      )}

      {/* Officers Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-xl font-semibold">Officers ({directors.length}/10)</h2>
          </div>
          <Button 
            onClick={() => {
              setEditingDirector(null);
              setIsDialogOpen(true);
            }}
            disabled={directors.length >= 10}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Officer
          </Button>
        </div>
      
      {directors.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Date of Appointment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {directors.map((director) => (
                <TableRow key={director.id}>
                  <TableCell className="font-medium">{director.computed_full_name}</TableCell>
                  <TableCell>{director.position}</TableCell>
                  <TableCell>{director.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{director.address}</TableCell>
                  <TableCell>{new Date(director.date_of_appointment).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(director)}
                        className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10 h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(director.id)}
                        className="text-red-500 hover:text-red-500 hover:bg-red-500/10 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </div>
  );
};
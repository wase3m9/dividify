import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Building, Calendar } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Officer {
  id: string;
  title: string;
  forenames: string;
  surname: string;
  position: string;
  address: string;
  email: string;
  date_of_appointment: string;
}

interface OfficersLayoutProps {
  companyId?: string;
}

export const OfficersLayout = ({ companyId }: OfficersLayoutProps) => {
  const [isAddingOfficer, setIsAddingOfficer] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    title: "",
    forenames: "",
    surname: "",
    position: "Director",
    address: "",
    email: "",
    date_of_appointment: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: officers = [], isLoading } = useQuery({
    queryKey: ['officers', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const handleAddOfficer = async () => {
    if (!companyId) return;
    
    if (!newOfficer.forenames || !newOfficer.surname || !newOfficer.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('officers')
        .insert({
          company_id: companyId,
          user_id: user.user.id,
          title: newOfficer.title,
          forenames: newOfficer.forenames,
          surname: newOfficer.surname,
          position: newOfficer.position,
          address: newOfficer.address,
          email: newOfficer.email,
          date_of_appointment: newOfficer.date_of_appointment,
        });

      if (error) throw error;

      toast({
        title: "Officer added",
        description: "Officer has been successfully added",
      });

      setNewOfficer({
        title: "",
        forenames: "",
        surname: "",
        position: "Director",
        address: "",
        email: "",
        date_of_appointment: new Date().toISOString().split('T')[0]
      });
      setIsAddingOfficer(false);
      queryClient.invalidateQueries({ queryKey: ['officers', companyId] });
    } catch (error: any) {
      toast({
        title: "Error adding officer",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveOfficer = async (officerId: string) => {
    try {
      const { error } = await supabase
        .from('officers')
        .delete()
        .eq('id', officerId);

      if (error) throw error;

      toast({
        title: "Officer removed",
        description: "Officer has been successfully removed",
      });

      queryClient.invalidateQueries({ queryKey: ['officers', companyId] });
    } catch (error: any) {
      toast({
        title: "Error removing officer",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!companyId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Please select a company to manage officers</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Officers ({officers.length})
            </CardTitle>
            <Button onClick={() => setIsAddingOfficer(true)} disabled={isAddingOfficer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Officer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingOfficer && (
            <Card className="mb-6 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Add New Officer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Mr/Mrs/Ms/Dr"
                      value={newOfficer.title}
                      onChange={(e) => setNewOfficer({ ...newOfficer, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="forenames">First Names *</Label>
                    <Input
                      id="forenames"
                      placeholder="John William"
                      value={newOfficer.forenames}
                      onChange={(e) => setNewOfficer({ ...newOfficer, forenames: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname *</Label>
                    <Input
                      id="surname"
                      placeholder="Smith"
                      value={newOfficer.surname}
                      onChange={(e) => setNewOfficer({ ...newOfficer, surname: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Director"
                      value={newOfficer.position}
                      onChange={(e) => setNewOfficer({ ...newOfficer, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@email.com"
                      value={newOfficer.email}
                      onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street, London"
                      value={newOfficer.address}
                      onChange={(e) => setNewOfficer({ ...newOfficer, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment_date">Date of Appointment</Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={newOfficer.date_of_appointment}
                      onChange={(e) => setNewOfficer({ ...newOfficer, date_of_appointment: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddOfficer}>Add Officer</Button>
                  <Button variant="outline" onClick={() => setIsAddingOfficer(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="text-center py-8">Loading officers...</div>
          ) : officers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No officers added yet</p>
              <p className="text-sm">Add your first officer to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {officers.map((officer) => (
                <Card key={officer.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {officer.title} {officer.forenames} {officer.surname}
                          </h3>
                          <Badge variant="secondary">{officer.position}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>📧 {officer.email}</div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Appointed: {new Date(officer.date_of_appointment).toLocaleDateString()}
                          </div>
                          {officer.address && (
                            <div className="md:col-span-2">📍 {officer.address}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOfficer(officer.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
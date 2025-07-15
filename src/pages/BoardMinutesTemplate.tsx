import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BoardMinutesTemplate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyId: '',
    meetingDate: '',
    meetingType: '',
    attendees: [''],
    resolutions: [''],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAttendeesChange = (index: number, value: string) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index] = value;
    setFormData(prev => ({ ...prev, attendees: updatedAttendees }));
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({ ...prev, attendees: [...prev.attendees, ''] }));
  };

  const handleRemoveAttendee = (index: number) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees.splice(index, 1);
    setFormData(prev => ({ ...prev, attendees: updatedAttendees }));
  };

  const handleResolutionsChange = (index: number, value: string) => {
    const updatedResolutions = [...formData.resolutions];
    updatedResolutions[index] = value;
    setFormData(prev => ({ ...prev, resolutions: updatedResolutions }));
  };

  const handleAddResolution = () => {
    setFormData(prev => ({ ...prev, resolutions: [...prev.resolutions, ''] }));
  };

  const handleRemoveResolution = (index: number) => {
    const updatedResolutions = [...formData.resolutions];
    updatedResolutions.splice(index, 1);
    setFormData(prev => ({ ...prev, resolutions: updatedResolutions }));
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('minutes')
        .insert({
          company_id: formData.companyId,
          user_id: user.id,
          meeting_date: formData.meetingDate,
          meeting_type: formData.meetingType,
          attendees: formData.attendees,
          resolutions: formData.resolutions,
          file_path: null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Board minutes saved successfully",
      });

      navigate('/board-minutes');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create Board Minutes</h1>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyId">Company ID</Label>
                <Input
                  type="text"
                  id="companyId"
                  value={formData.companyId}
                  onChange={(e) => handleInputChange(e, 'companyId')}
                  placeholder="Enter company ID"
                />
              </div>
              <div>
                <Label htmlFor="meetingDate">Meeting Date</Label>
                <Input
                  type="date"
                  id="meetingDate"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange(e, 'meetingDate')}
                />
              </div>
              <div>
                <Label htmlFor="meetingType">Meeting Type</Label>
                <Input
                  type="text"
                  id="meetingType"
                  value={formData.meetingType}
                  onChange={(e) => handleInputChange(e, 'meetingType')}
                  placeholder="Enter meeting type"
                />
              </div>
              <div>
                <Label>Attendees</Label>
                {formData.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      type="text"
                      value={attendee}
                      onChange={(e) => handleAttendeesChange(index, e.target.value)}
                      placeholder="Enter attendee name"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveAttendee(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={handleAddAttendee}>
                  Add Attendee
                </Button>
              </div>
              <div>
                <Label>Resolutions</Label>
                {formData.resolutions.map((resolution, index) => (
                  <div key={index} className="flex flex-col space-y-2 mb-2">
                    <Textarea
                      value={resolution}
                      onChange={(e) => handleResolutionsChange(index, e.target.value)}
                      placeholder="Enter resolution"
                      className="min-h-[80px]"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveResolution(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={handleAddResolution}>
                  Add Resolution
                </Button>
              </div>
              <Button onClick={handleSave}>Save Board Minutes</Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BoardMinutesTemplate;

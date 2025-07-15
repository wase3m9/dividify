import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  companyId: string;
  meetingDate: string;
  meetingType: string;
  attendees: string[];
  resolutions: string[];
}

const BoardMinutesPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    companyId: '',
    meetingDate: '',
    meetingType: '',
    attendees: [],
    resolutions: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      attendees: checked
        ? [...prev.attendees, name]
        : prev.attendees.filter(attendee => attendee !== name),
    }));
  };

  const handleResolutionChange = (index: number, value: string) => {
    const updatedResolutions = [...formData.resolutions];
    updatedResolutions[index] = value;
    setFormData(prev => ({ ...prev, resolutions: updatedResolutions }));
  };

  const addResolution = () => {
    setFormData(prev => ({ ...prev, resolutions: [...prev.resolutions, ''] }));
  };

  const removeResolution = (index: number) => {
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
          <Card>
            <CardHeader>
              <CardTitle>Board Meeting Minutes</CardTitle>
              <CardDescription>
                Fill in the details of the board meeting to generate minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyId">Company ID</Label>
                  <Input
                    type="text"
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    placeholder="Enter company ID"
                  />
                </div>
                <div>
                  <Label htmlFor="meetingDate">Meeting Date</Label>
                  <Input
                    type="date"
                    id="meetingDate"
                    name="meetingDate"
                    value={formData.meetingDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="meetingType">Meeting Type</Label>
                <Input
                  type="text"
                  id="meetingType"
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleInputChange}
                  placeholder="e.g., Annual General Meeting"
                />
              </div>

              <div>
                <Label>Attendees</Label>
                <div className="flex flex-col space-y-2">
                  <div>
                    <Checkbox
                      id="attendee1"
                      name="James Wilson"
                      checked={formData.attendees.includes('James Wilson')}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange({
                          target: { name: 'James Wilson', checked },
                          currentTarget: { name: 'James Wilson', checked },
                        } as any)
                      }
                    />
                    <Label htmlFor="attendee1" className="ml-2">
                      James Wilson
                    </Label>
                  </div>
                  <div>
                    <Checkbox
                      id="attendee2"
                      name="Emily Carter"
                      checked={formData.attendees.includes('Emily Carter')}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange({
                          target: { name: 'Emily Carter', checked },
                          currentTarget: { name: 'Emily Carter', checked },
                        } as any)
                      }
                    />
                    <Label htmlFor="attendee2" className="ml-2">
                      Emily Carter
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label>Resolutions</Label>
                {formData.resolutions.map((resolution, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <Textarea
                      value={resolution}
                      onChange={(e) => handleResolutionChange(index, e.target.value)}
                      placeholder={`Resolution ${index + 1}`}
                      className="flex-1"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeResolution(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" onClick={addResolution}>
                  Add Resolution
                </Button>
              </div>

              <Button onClick={handleSave}>Save Minutes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BoardMinutesPreview;

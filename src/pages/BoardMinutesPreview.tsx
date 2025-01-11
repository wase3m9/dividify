import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Packer } from "docx";
import { downloadPDF, downloadWord } from "@/utils/documentGenerator";
import { useEffect, useState } from "react";

const BoardMinutesPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const formData = location.state || {};
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch company data",
        });
        return;
      }

      setCompany(data);
    };

    fetchCompanyData();
  }, [toast]);

  const handleDownload = async (format: 'pdf' | 'word') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not authenticated",
        });
        return;
      }

      if (!company) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company data not found",
        });
        return;
      }

      const documentData = {
        companyName: company.name,
        registrationNumber: company.registration_number || "",
        registeredAddress: company.registered_address || "",
        shareholderName: "",
        shareholderAddress: "",
        voucherNumber: 1,
        paymentDate: formData.paymentDate || new Date().toISOString(),
        shareClass: formData.shareClassName || "",
        amountPerShare: "0",
        totalAmount: formData.amount?.toString() || "0",
        directorName: formData.directors?.[0]?.name || "",
        financialYearEnding: formData.financialYearEnd || new Date().toISOString(),
        meetingDate: formData.meetingDate,
        meetingAddress: formData.meetingAddress,
        directors: formData.directors || [],
        dividendType: formData.dividendType || "Final",
      };

      let filePath = '';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `board_minutes_${timestamp}.${format}`;

      if (format === 'pdf') {
        const doc = await downloadPDF(documentData);
        const pdfBlob = doc.output('blob');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dividend_vouchers')
          .upload(fileName, pdfBlob, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
      } else {
        const doc = await downloadWord(documentData);
        const blob = await Packer.toBlob(doc);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dividend_vouchers')
          .upload(fileName, blob, {
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            upsert: false
          });

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
      }

      const { error: saveError } = await supabase
        .from('minutes')
        .insert({
          company_id: company.id,
          user_id: user.id,
          title: `Board Minutes - ${new Date(formData.meetingDate).toLocaleDateString()}`,
          meeting_date: formData.meetingDate,
          file_path: filePath
        });

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: `Board minutes downloaded and saved successfully as ${format.toUpperCase()}`,
      });

      navigate("/dividend-board");
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${format.toUpperCase()} document`,
      });
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-xl font-semibold">Preview Board Minutes</h2>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleDownload('pdf')}
                  className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={() => handleDownload('word')}
                  className="bg-[#9b87f5] hover:bg-[#8b77e5]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Word
                </Button>
              </div>
              
              <div className="mt-8 p-6 border rounded-lg">
                <div className="space-y-4">
                  <div className="text-center">
                    <h1 className="font-bold text-xl">{company.name}</h1>
                    <p className="text-sm">Company number: {company.registration_number}</p>
                    <p className="text-sm">{company.registered_address}</p>
                  </div>
                  
                  <div className="my-8 border-t border-gray-300" />
                  <h2 className="text-center font-bold">MINUTES OF MEETING OF THE DIRECTORS</h2>
                  <div className="border-t border-gray-300 mb-8" />
                  
                  <div className="space-y-2 mt-8 text-left">
                    <div className="flex">
                      <span className="font-semibold w-32">Date held:</span>
                      <span>{formData.meetingDate}</span>
                    </div>
                    <div className="flex">
                      <span className="font-semibold w-32">Held at:</span>
                      <span>{formData.meetingAddress}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold w-32">Present:</span>
                      <div>
                        {formData.directors?.map((director: any, index: number) => (
                          <div key={index}>{director.name} (Director)</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-12 text-left">
                    <h3 className="font-semibold">1. NOTICE AND QUORUM</h3>
                    <p>The chairperson reported that sufficient notice of the meeting had been given to all the directors, and as a quorum was present declared the meeting open.</p>
                    
                    <h3 className="font-semibold">2. DIVIDEND PAYMENT</h3>
                    <p>It was resolved, having considered the Company's statutory accounts for the year ended {formData.financialYearEnd} that the Company pay on {formData.paymentDate} a {formData.dividendType.toLowerCase()} dividend for the year of £{formData.amount} ({formData.shareClassName}) share of £{formData.nominalValue} each in respect of the year ended {formData.financialYearEnd} to those shareholders registered at the close of business {formData.paymentDate}.</p>
                    <p>It was resolved that dividend vouchers be distributed to shareholders and bank transfers made accordingly.</p>
                    
                    <h3 className="font-semibold">3. CLOSE</h3>
                    <p>There being no further business the meeting was closed.</p>
                    
                    <div className="mt-16 space-y-4">
                      <p>Signed: _________________________</p>
                      <p>Dated: _________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              onClick={() => navigate("/dividend-board")}
              className="bg-[#9b87f5] hover:bg-[#8b77e5]"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMinutesPreview;
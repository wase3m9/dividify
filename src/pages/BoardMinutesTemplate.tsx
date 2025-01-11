import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useLocation } from "react-router-dom";
import { downloadPDF, downloadWord } from "@/utils/documentGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BoardMinutesTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const formData = location.state || {};

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

      const documentData = {
        companyName: formData.companyName || "Company Name Limited",
        registrationNumber: formData.registrationNumber || "12345678",
        registeredAddress: formData.registeredAddress || "123 Business Street",
        shareholderName: "",
        shareholderAddress: "",
        voucherNumber: 1,
        paymentDate: formData.paymentDate || new Date().toISOString(),
        shareClass: formData.shareClassName || "",
        amountPerShare: "0",
        totalAmount: formData.amount?.toString() || "0",
        directorName: "",
        financialYearEnding: formData.financialYearEnd || new Date().toISOString(),
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

      // Save the record to the database
      const { error: saveError } = await supabase
        .from('minutes')
        .insert({
          company_id: formData.companyId,
          user_id: user.id,
          title: formData.title || 'Board Minutes',
          meeting_date: formData.meetingDate || new Date().toISOString(),
          file_path: filePath
        });

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: `Board minutes downloaded and saved successfully as ${format.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${format.toUpperCase()} document`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-xl font-semibold text-center">Board Minutes Document</h2>
          
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
                  <h1 className="text-center font-bold text-xl">COMPANY NAME LIMITED</h1>
                  <p className="text-center">Company number: Company registration number</p>
                  <p className="text-center">Registered office address: Address line 1, Address line 2, Town, County, Postcode</p>
                  
                  <h2 className="text-center font-bold mt-8">MINUTES OF MEETING OF THE DIRECTORS</h2>
                  
                  <div className="space-y-2 mt-8">
                    <p><span className="font-semibold">Date held:</span> {formData.meetingDate}</p>
                    <p><span className="font-semibold">Held at:</span> {formData.meetingAddress}</p>
                    <p><span className="font-semibold">Present:</span></p>
                    <ul className="list-disc pl-8">
                      {formData.directors?.map((director: any, index: number) => (
                        <li key={index}>{director.name} (Director)</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    <h3 className="font-semibold">1. NOTICE AND QUORUM</h3>
                    <p>The chairperson reported that sufficient notice of the meeting had been given to all the directors, and as a quorum was present declared the meeting open.</p>
                    
                    <h3 className="font-semibold">2. DIVIDEND PAYMENT</h3>
                    <p>It was resolved, having considered the Company's statutory accounts for the year ended {formData.financialYearEnd} that the Company pay on {formData.paymentDate} a final dividend for the year of £{formData.amount} ({formData.shareClassName}) share of £{formData.nominalValue} each in respect of the year ended {formData.financialYearEnd} to those shareholders registered at the close of business {formData.paymentDate}.</p>
                    <p>It was resolved that dividend vouchers be distributed to shareholders and bank transfers made accordingly.</p>
                    
                    <h3 className="font-semibold">3. CLOSE</h3>
                    <p>There being no further business the meeting was closed.</p>
                    
                    <div className="mt-8 space-y-4">
                      <p>Signed: _________________________</p>
                      <p>Dated: _________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BoardMinutesTemplate;
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { downloadPDF, downloadWord } from "@/utils/documentGenerator"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { DocumentPreview } from "@/utils/previewRenderer"
import { templates } from "@/utils/documentGenerator/templates"
import { Packer } from "docx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Company {
  id: string;
  name: string;
  registration_number: string;
  registered_address: string;
}

export const TemplateSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  const [recordId, setRecordId] = useState<string | null>(null);
  const formData = location.state || {};

  console.log("Form Data in Template Selection:", formData); // Debug log

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get the companyId from the form data
        const companyId = formData.companyId;
        if (!companyId) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Company ID not found in form data",
          });
          return;
        }

        const { data: company, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyId)
          .maybeSingle();

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch company details",
          });
          return;
        }

        if (company) {
          setCompany(company);
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch company details",
        });
      }
    };

    fetchCompanyDetails();
  }, [formData.companyId, toast]);

  const createOrUpdateRecord = async (filePath: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (!company) throw new Error("Company data not found");

      const paymentDate = formData.paymentDate ? new Date(formData.paymentDate).toISOString() : new Date().toISOString();
      const financialYearEnding = formData.financialYearEnding ? new Date(formData.financialYearEnding).toISOString() : new Date().toISOString();

      if (recordId) {
        const { error: updateError } = await supabase
          .from('dividend_records')
          .update({ file_path: filePath })
          .eq('id', recordId);

        if (updateError) throw updateError;
      } else {
        const { data: newRecord, error: saveError } = await supabase
          .from('dividend_records')
          .insert({
            company_id: company.id,
            user_id: user.id,
            shareholder_name: formData.shareholderName || '',
            share_class: formData.shareClass || '',
            payment_date: paymentDate,
            financial_year_ending: financialYearEnding,
            amount_per_share: parseFloat(formData.amountPerShare || '0'),
            total_amount: parseFloat(formData.totalAmount || '0'),
            director_name: formData.directorName || '',
            file_path: filePath
          })
          .select()
          .single();

        if (saveError) throw saveError;
        setRecordId(newRecord.id);
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleDownload = async (templateId: string, format: 'pdf' | 'word') => {
    if (!company) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Company details not found",
      });
      return;
    }

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

      console.log("Form Data being processed:", formData);

      const documentData = {
        companyName: company.name,
        registrationNumber: company.registration_number || '',
        registeredAddress: company.registered_address || '',
        shareholderName: formData.shareholderName || '',
        shareholderAddress: formData.shareholderAddress || '', // Ensure shareholder address is included
        shareClass: formData.shareClass || '',
        paymentDate: formData.paymentDate || new Date().toISOString(), // Use the payment date from the form
        amountPerShare: formData.amountPerShare?.toString() || '0',
        totalAmount: formData.totalAmount?.toString() || '0',
        voucherNumber: 1,
        financialYearEnding: formData.financialYearEnding || new Date().toISOString(),
        holdings: formData.shareholdings?.toString() || '',
      };

      console.log("Document Data being sent:", documentData);

      let filePath = '';
      const now = new Date();
      // Format: DD-MM-YYYY_HH-mm-ss
      const timestamp = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/[/:]/g, '-').replace(',', '').replace(/ /g, '_');
      
      const fileName = `dividend_voucher_${timestamp}.${format}`;

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

      await createOrUpdateRecord(filePath);

      toast({
        title: "Success",
        description: `Dividend voucher downloaded successfully as ${format.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${format.toUpperCase()} document. Please ensure all required fields are filled.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-600 bg-blue-500/10 p-4 rounded-md">
        Choose a template to use
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="aspect-[3/4] bg-gray-100 mb-4 rounded flex items-center justify-center overflow-hidden">
              <DocumentPreview template={template.id} />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-center">{template.name}</h3>
              <p className="text-sm text-gray-500 text-center">{template.description}</p>
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className={`text-blue-600 font-medium flex items-center gap-2 ${
                        selectedTemplate !== template.id ? 'opacity-50' : ''
                      }`}
                      disabled={selectedTemplate !== template.id}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDownload(template.id, 'pdf')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownload(template.id, 'word')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Download as Word
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{template.name} Template Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-[1/1.414] bg-white rounded-lg shadow-inner p-4">
                      <DocumentPreview template={template.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Previous
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={() => navigate('/dividend-board')}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

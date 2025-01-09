import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText } from "lucide-react"
import { useLocation } from "react-router-dom"
import { downloadPDF, downloadWord } from "@/utils/documentGenerator"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import { DocumentPreview } from "@/utils/previewRenderer"
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

const templates = [
  { id: 'basic', name: 'Basic', selected: true },
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' }
];

interface Company {
  name: string;
  registration_number: string;
  registered_address: string;
}

export const TemplateSelection = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [voucherNumber, setVoucherNumber] = useState(1);
  const formData = location.state || {};

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (companies) {
        setCompany(companies);
      }
    };

    fetchCompanyDetails();
  }, []);

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
      const documentData = {
        companyName: company.name,
        registrationNumber: company.registration_number || '',
        registeredAddress: company.registered_address || '',
        shareholderName: formData.shareholderName || '',
        shareholderAddress: formData.shareholderAddress || '',
        shareClass: formData.shareClass || '',
        paymentDate: formData.paymentDate || '',
        amountPerShare: formData.amountPerShare || '0',
        totalAmount: formData.totalAmount || '0',
        voucherNumber: voucherNumber,
      };

      if (format === 'pdf') {
        downloadPDF(documentData);
      } else {
        await downloadWord(documentData);
      }

      toast({
        title: "Success",
        description: `Dividend voucher downloaded successfully as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${format.toUpperCase()} document`,
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
          <Card key={template.id} className={`p-4 ${template.selected ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="aspect-[3/4] bg-gray-100 mb-4 rounded flex items-center justify-center overflow-hidden">
              <DocumentPreview template={template.id as 'basic' | 'classic' | 'modern'} />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-center">{template.name}</h3>
              <div className="flex justify-center">
                {template.selected ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="text-blue-600 font-medium flex items-center gap-2"
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
                ) : (
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    Use this template
                  </Button>
                )}
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
                      <DocumentPreview template={template.id as 'basic' | 'classic' | 'modern'} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline">Previous</Button>
        <Button className="bg-green-500 hover:bg-green-600">
          Continue
        </Button>
      </div>
    </div>
  );
};
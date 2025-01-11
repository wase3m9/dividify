import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { CompanyForm } from "./company/CompanyForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  registered_address: string | null;
}

interface CompanySectionProps {
  company: Company | null;
  onCompanyUpdate: () => void;
}

export const CompanySection = ({ company, onCompanyUpdate }: CompanySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    onCompanyUpdate();
    setIsDialogOpen(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Company</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="text-[#9b87f5] border-[#9b87f5]"
            >
              {company ? "Edit Company" : "Add Company"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <CompanyForm 
              existingCompany={company}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
      {company ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="text-gray-500">Name:</div>
          <div>{company.name}</div>
          
          <div className="text-gray-500">Registration Number:</div>
          <div>{company.registration_number}</div>
          
          <div className="text-gray-500">Registered Address:</div>
          <div>{company.registered_address}</div>
        </div>
      ) : (
        <p className="text-gray-500">No company information added yet.</p>
      )}
    </Card>
  );
};
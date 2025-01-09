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
  place_of_registration: string | null;
}

interface CompanySectionProps {
  company: Company | null;
  onCompanyUpdate: () => void;
}

export const CompanySection = ({ company, onCompanyUpdate }: CompanySectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Company Information</h2>
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
              onSuccess={() => {
                setIsDialogOpen(false);
                onCompanyUpdate();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {company ? (
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {company.name}</p>
          <p><span className="font-medium">Registration Number:</span> {company.registration_number}</p>
          <p><span className="font-medium">Registered Address:</span> {company.registered_address}</p>
          <p><span className="font-medium">Place of Registration:</span> {company.place_of_registration}</p>
        </div>
      ) : (
        <p className="text-gray-500">No company information added yet.</p>
      )}
    </Card>
  );
};
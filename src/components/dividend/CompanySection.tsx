import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { CompanyForm } from "./CompanyForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Company {
  id: string;
  name: string;
  registration_number: string | null;
  registered_address: string | null;
  trade_classification: string | null;
  registered_email: string | null;
  incorporation_date: string | null;
  place_of_registration: string | null;
  company_category: string | null;
  trading_on_market: boolean | null;
  company_status: string | null;
  accounting_category: string | null;
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
          <p><span className="font-medium">Trade Classification:</span> {company.trade_classification}</p>
          <p><span className="font-medium">Registered Email:</span> {company.registered_email}</p>
          <p><span className="font-medium">Incorporation Date:</span> {
            company.incorporation_date ? format(new Date(company.incorporation_date), 'dd/MM/yyyy') : 'Not specified'
          }</p>
          <p><span className="font-medium">Place of Registration:</span> {company.place_of_registration}</p>
          <p><span className="font-medium">Company Category:</span> {company.company_category}</p>
          <p><span className="font-medium">Trading on Market:</span> {company.trading_on_market ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Company Status:</span> {company.company_status}</p>
          <p><span className="font-medium">Accounting Category:</span> {company.accounting_category}</p>
        </div>
      ) : (
        <p className="text-gray-500">No company information added yet.</p>
      )}
    </Card>
  );
};
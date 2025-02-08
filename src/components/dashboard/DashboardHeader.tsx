
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/dividend/company/CompanyForm";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  displayName: string;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onCompanyCreated: () => void;
}

export const DashboardHeader = ({
  displayName,
  isDialogOpen,
  setIsDialogOpen,
  onCompanyCreated,
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {displayName}</h1>
        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Company
          </Button>
        </DialogTrigger>
        <DialogContent>
          <CompanyForm onSuccess={onCompanyCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

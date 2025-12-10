import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { CreateBoardPackDialog } from "./CreateBoardPackDialog";

interface Company {
  id: string;
  name: string;
  registration_number?: string | null;
  registered_address?: string | null;
}

interface CreateBoardPackButtonProps {
  company: Company;
  logoUrl?: string;
  accountantFirmName?: string;
}

export const CreateBoardPackButton = ({
  company,
  logoUrl,
  accountantFirmName,
}: CreateBoardPackButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-primary hover:bg-primary/90"
      >
        <Package className="mr-2 h-4 w-4" />
        Create Board Pack
      </Button>

      <CreateBoardPackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={company}
        logoUrl={logoUrl}
        accountantFirmName={accountantFirmName}
      />
    </>
  );
};

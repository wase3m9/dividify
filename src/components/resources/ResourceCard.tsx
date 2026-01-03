import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { EmailCaptureDialog } from "./EmailCaptureDialog";

interface ResourceCardProps {
  title: string;
  description: string;
  pdfPath: string;
  icon?: React.ReactNode;
}

export const ResourceCard = ({ title, description, pdfPath, icon }: ResourceCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border hover:border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/15 transition-colors duration-300">
            {icon || <FileText className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <Button 
            onClick={() => setDialogOpen(true)}
            className="w-full"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Free PDF
          </Button>
        </CardContent>
      </Card>

      <EmailCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resourceTitle={title}
        resourceDescription={description}
        pdfPath={pdfPath}
      />
    </>
  );
};

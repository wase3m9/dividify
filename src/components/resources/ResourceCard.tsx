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
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
        <div className="absolute inset-[1px] rounded-lg bg-card" />
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative pb-2">
          {/* Floating icon with glow effect */}
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-5 shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative text-primary-foreground">
              {icon || <FileText className="w-6 h-6" />}
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-primary group-hover:to-primary/80 transition-all duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative pt-2">
          <Button 
            onClick={() => setDialogOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group/btn"
          >
            <Download className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
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

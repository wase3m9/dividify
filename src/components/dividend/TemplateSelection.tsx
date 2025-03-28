import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { templates } from "@/utils/documentGenerator/templates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TemplateCard } from "./template/TemplateCard";
import { useCompanyData } from "./template/useCompanyData";
import { useTemplateActions } from "./template/useTemplateActions";

export const TemplateSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state || {};
  const [selectedTemplate, setSelectedTemplate] = useState('basic');
  
  const { company, error, isLoading } = useCompanyData(formData.companyId);
  const { handleDownload } = useTemplateActions(company, formData);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[600px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Previous
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-600 bg-blue-500/10 p-4 rounded-md">
        Choose a template for your dividend voucher
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onSelect={setSelectedTemplate}
            onDownload={handleDownload}
          />
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
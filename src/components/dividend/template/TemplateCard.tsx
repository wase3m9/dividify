import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DocumentPreview } from "@/utils/previewRenderer";
import { TemplateId } from "@/utils/documentGenerator/templates";

interface TemplateCardProps {
  template: {
    id: TemplateId;
    name: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: (id: TemplateId) => void;
  onDownload: (templateId: TemplateId, format: 'pdf') => Promise<void>;
}

export const TemplateCard = ({
  template,
  isSelected,
  onSelect,
  onDownload,
}: TemplateCardProps) => {
  return (
    <Card 
      className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(template.id)}
    >
      <div className="aspect-[3/4] bg-gray-100 mb-6 rounded flex items-center justify-center overflow-hidden">
        <DocumentPreview template={template.id} />
      </div>
      <div className="space-y-4">
        <h3 className="font-medium text-center text-lg">{template.name}</h3>
        <p className="text-sm text-gray-500 text-center">{template.description}</p>
        <div className="flex justify-center">
          <Button 
            className={`text-blue-600 font-medium flex items-center gap-2 ${
              !isSelected ? 'opacity-50' : ''
            }`}
            disabled={!isSelected}
            onClick={() => onDownload(template.id, 'pdf')}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </Card>
  );
};
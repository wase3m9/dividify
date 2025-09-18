import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Crown } from "lucide-react";
import { DocumentPreview } from "@/utils/previewRenderer";
import { TemplateId } from "@/utils/documentGenerator/templates";

interface TemplateCardProps {
  template: {
    id: TemplateId;
    name: string;
    description: string;
    isPremium?: boolean;
  };
  isSelected: boolean;
  onSelect: (id: TemplateId) => void;
  onDownload: (templateId: TemplateId, format: 'pdf') => Promise<void>;
  isDisabled?: boolean;
}

export const TemplateCard = ({
  template,
  isSelected,
  onSelect,
  onDownload,
  isDisabled = false,
}: TemplateCardProps) => {
  return (
    <Card 
      className={`p-6 transition-all hover:shadow-lg relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${template.isPremium ? 'border-2 border-gradient-to-br from-amber-400 to-orange-500' : ''} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={() => !isDisabled && onSelect(template.id)}
    >
      {template.isPremium && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}
      
      <div className={`aspect-[3/4] mb-6 rounded flex items-center justify-center overflow-hidden ${
        template.isPremium 
          ? 'bg-gradient-to-br from-gray-900 to-gray-700' 
          : 'bg-gray-100'
      }`}>
        <DocumentPreview template={template.id} />
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <h3 className={`font-medium text-lg ${template.isPremium ? 'text-amber-600' : ''}`}>
            {template.name}
          </h3>
          {template.isPremium && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-600 font-medium">Premium Features</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 text-center">{template.description}</p>
        <div className="flex justify-center">
          <Button 
            className={`font-medium flex items-center gap-2 ${
              !isSelected || isDisabled ? 'opacity-50' : ''
            } ${
              template.isPremium 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' 
                : 'text-blue-600'
            }`}
            disabled={!isSelected || isDisabled}
            onClick={() => onDownload(template.id, 'pdf')}
          >
            {isDisabled ? 'Upgrade Required' : 'Generate Preview'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
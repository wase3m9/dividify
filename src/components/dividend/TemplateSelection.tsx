import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const templates = [
  { id: 'basic', name: 'Basic', selected: true },
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'traditional', name: 'Traditional' },
  { id: 'bold', name: 'Bold' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'contemporary', name: 'Contemporary' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'vibrant', name: 'Vibrant' }
];

export const TemplateSelection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-600 bg-blue-500/10 p-4 rounded-md">
        Choose a template to use
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={`p-4 ${template.selected ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="aspect-[3/4] bg-gray-100 mb-4 rounded flex items-center justify-center">
              <div className="w-16 h-20 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-center">{template.name}</h3>
              <div className="flex justify-center">
                {template.selected ? (
                  <div className="text-sm text-blue-600 font-medium">Template selected</div>
                ) : (
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    Use this template
                  </Button>
                )}
              </div>
              <div className="flex justify-center">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline">Previous</Button>
        <Button className="bg-green-500 hover:bg-green-600">
          Continue
        </Button>
      </div>
    </div>
  );
};
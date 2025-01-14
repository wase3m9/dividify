import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { DividendFormHeader } from "@/components/dividend/DividendFormHeader";
import { TemplateSelection } from "@/components/dividend/TemplateSelection";
import { useLocation } from "react-router-dom";

const DividendTemplate = () => {
  const location = useLocation();
  const formData = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto space-y-8">
          <DividendFormHeader
            title="Choose Template"
            description="Select a template for your dividend voucher."
            progress={100}
          />

          <Card className="p-6">
            <TemplateSelection />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DividendTemplate;
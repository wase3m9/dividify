import { Card } from "@/components/ui/card";
import { FileCheck, Clock, Users } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Everything You Need for Dividend Management
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Compliant Documentation</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Generate legally compliant dividend vouchers and board meeting minutes automatically.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Time-Saving</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Save hours of administrative work with our automated document generation.
            </p>
          </Card>

          <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-[#9b87f5]" />
              <h3 className="text-xl font-semibold">Multi-Shareholder</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Manage multiple shareholders and different share classes effortlessly.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
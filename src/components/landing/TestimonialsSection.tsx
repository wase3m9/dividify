import { Card } from "@/components/ui/card";
import { MessageSquareQuote } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 bg-white relative">
            <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
            <p className="text-gray-600 mb-6">
              "Dividify has transformed how we handle dividend documentation. It's saved us countless hours and ensures we're always compliant."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">Director, Tech Solutions Ltd</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white relative">
            <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
            <p className="text-gray-600 mb-6">
              "The automated document generation is fantastic. It's like having a company secretary at your fingertips."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                JS
              </div>
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-gray-500">CEO, Growth Ventures</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white relative">
            <MessageSquareQuote className="absolute -top-4 -left-4 h-8 w-8 text-[#9b87f5]" />
            <p className="text-gray-600 mb-6">
              "The interface is intuitive and the support team is incredibly helpful. Best investment for our company administration."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#9b87f5] rounded-full flex items-center justify-center text-white font-semibold">
                RB
              </div>
              <div>
                <p className="font-semibold">Robert Brown</p>
                <p className="text-sm text-gray-500">Director, Innovative Solutions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
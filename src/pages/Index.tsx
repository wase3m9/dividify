import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileCheck, FileText, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-6 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Compliant Dividend Documentation Made Simple
            </h1>
            <p className="text-lg text-gray-600 md:text-xl">
              Generate professional board meeting minutes and dividend vouchers for your UK limited company in minutes.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="hover-lift">
                <Link to="/create">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover-lift">
              <FileText className="h-12 w-12 mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">Board Meeting Minutes</h3>
              <p className="text-gray-600">
                Generate compliant meeting minutes documenting dividend declarations with all necessary details.
              </p>
            </Card>

            <Card className="p-6 hover-lift">
              <FileCheck className="h-12 w-12 mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">Dividend Vouchers</h3>
              <p className="text-gray-600">
                Create professional dividend vouchers with all required information for shareholders and company records.
              </p>
            </Card>

            <Card className="p-6 hover-lift">
              <Shield className="h-12 w-12 mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">Legal Compliance</h3>
              <p className="text-gray-600">
                Stay compliant with UK company law requirements for dividend documentation.
              </p>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Why Proper Dividend Documentation Matters
            </h2>
            <div className="prose prose-gray mx-auto">
              <p className="text-gray-600 leading-relaxed">
                Under UK company law, proper documentation is essential when declaring and paying dividends. 
                This includes holding a directors' meeting to declare the dividend and issuing dividend vouchers 
                to shareholders. Failure to maintain proper records can result in dividends being classified as 
                unlawful, leading to potential tax implications and legal issues.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our tool helps you generate all the necessary paperwork, ensuring you maintain proper records 
                and comply with legal requirements. Whether you're a director, accountant, or company secretary, 
                our simple process makes dividend documentation straightforward and professional.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            DividendDocs - Simplifying dividend documentation for UK companies
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
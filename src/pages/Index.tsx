import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Hero Section - Reduced spacing */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Dividend Voucher and Board Meeting Solutions for Savvy Directors
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mt-4">
              Turn compliance into simplicity. Tailored for directors who need to manage dividends and board meetings effortlessly.
            </p>
            <div className="pt-8">
              <Button size="lg" asChild className="hover-lift">
                <Link to="/trial">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section - With new content */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for Director Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 hover-lift">
              <h3 className="text-xl font-semibold mb-3">Customizable Templates</h3>
              <p className="text-gray-600">
                Simplify your compliance with pre-designed templates for dividend vouchers and board meeting minutes.
              </p>
            </Card>

            <Card className="p-6 hover-lift">
              <h3 className="text-xl font-semibold mb-3">Integrated Workflows</h3>
              <p className="text-gray-600">
                Automatically link dividend declarations with your financials and shareholder records.
              </p>
            </Card>

            <Card className="p-6 hover-lift">
              <h3 className="text-xl font-semibold mb-3">Secure and Confidential</h3>
              <p className="text-gray-600">
                Your corporate data is protected with enterprise-grade security.
              </p>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20">
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

        {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            Dividify - Simplifying dividend documentation for UK companies
          </p>
        </div>
      </footer>
      </main>
    </div>
  );
};

export default Index;

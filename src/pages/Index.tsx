import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileText, Link2, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#9b87f5] to-gray-900 bg-clip-text text-transparent">
                Dividend Voucher and Board Meeting Solutions for Savvy Directors
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Turn compliance into simplicity. Tailored for directors who need to manage dividends and board meetings effortlessly.
            </p>
            <div className="pt-8">
              <Button size="lg" className="bg-[#9b87f5] hover:bg-[#8b77e5] hover-lift shadow-sm" asChild>
                <Link to="/trial">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">
              Built for Director Success
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Customizable Templates</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Simplify your compliance with pre-designed templates for dividend vouchers and board meeting minutes.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Link2 className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Integrated Workflows</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Automatically link dividend declarations with your financials and shareholder records.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Secure and Confidential</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your corporate data is protected with enterprise-grade security.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
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
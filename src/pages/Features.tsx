import { Navigation } from "@/components/Navigation";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Globe, Users, Database, Clock } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Features - Professional Dividend Management | Dividify</title>
        <meta name="description" content="Discover all Dividify features for dividend voucher generation, board minutes creation, and compliance management for UK limited companies." />
        <meta name="keywords" content="dividend voucher features, board minutes generator, UK company compliance, HMRC dividend compliance, professional dividend management" />
        <link rel="canonical" href={`${window.location.origin}/features`} />
      </Helmet>
      
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-4">
        <SiteBreadcrumbs />
      </div>
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-[#9b87f5]">Complete Dividend Management</span> Solution
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Everything you need to manage dividends professionally, stay compliant, and save time on administrative tasks.
          </p>
        </section>

        {/* Main Features Section */}
        <FeaturesSection />

        {/* Additional Features */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              Advanced Features for Professional Use
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Bank-Level Security</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Your company data is protected with 256-bit encryption and secure cloud storage.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Lightning Fast</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Generate complete dividend documentation in under 30 seconds.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Cloud-Based</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Access your dividend records from anywhere with internet connection.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Team Collaboration</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Share access with your accountant or business partners securely.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">Data Export</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Export your data in multiple formats for accounting software integration.
                </p>
              </Card>

              <Card className="p-8 hover-lift bg-white border-0 shadow-sm rounded-[20px]">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-[#9b87f5]" />
                  <h3 className="text-xl font-semibold">24/7 Availability</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Generate documents whenever you need them, no office hours required.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-[#9b87f5]">
              Built for UK Compliance
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Our templates and processes are designed specifically for UK limited companies, 
              ensuring full compliance with Companies House and HMRC requirements.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 bg-white border-2 border-blue-100 hover:border-[#9b87f5] shadow-sm rounded-[20px] transition-all hover-lift">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                  <div className="w-8 h-8 bg-[#9b87f5] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">CH</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#9b87f5]">Companies House Ready</h3>
                <p className="text-gray-600">
                  All board minutes templates comply with Companies Act 2006 requirements 
                  and are ready for filing with Companies House.
                </p>
              </Card>
              
              <Card className="p-8 bg-white border-2 border-purple-100 hover:border-[#9b87f5] shadow-sm rounded-[20px] transition-all hover-lift">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
                  <div className="w-8 h-8 bg-[#9b87f5] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">HR</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#9b87f5]">HMRC Compliant</h3>
                <p className="text-gray-600">
                  Dividend vouchers include all required information for tax returns 
                  and self-assessment submissions.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Features;
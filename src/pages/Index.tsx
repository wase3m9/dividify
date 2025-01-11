import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  FileText, 
  Link2, 
  Shield, 
  CheckCircle,
  Zap,
  Users,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartFreeTrial = () => {
    if (user) {
      navigate("/dividend-board");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-screen py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* New badge/bubble */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm mb-6">
              <CheckCircle className="h-4 w-4 text-[#8E9196]" />
              Built for Directors legal compliance
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-[#9b87f5] to-gray-900 bg-clip-text text-transparent">
                Dividend Voucher and Board Meeting Solutions for Savvy Directors
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Turn compliance into simplicity. Tailored for directors who need to manage dividends and board meetings effortlessly.
            </p>
            <div className="pt-8">
              <Button 
                size="lg" 
                className="bg-[#9b87f5] hover:bg-[#8b77e5] hover-lift shadow-sm"
                onClick={handleStartFreeTrial}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
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

        {/* Pricing Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all">
                <h3 className="text-xl font-bold mb-4">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£9</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Up to 2 companies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Basic document templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  onClick={handleStartFreeTrial}
                >
                  Start Free Trial
                </Button>
              </Card>

              <Card className="p-8 hover-lift border-2 border-[#9b87f5] relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9b87f5] text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold mb-4">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Up to 5 companies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Premium templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Advanced features</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  onClick={handleStartFreeTrial}
                >
                  Start Free Trial
                </Button>
              </Card>

              <Card className="p-8 hover-lift border-2 border-transparent hover:border-[#9b87f5] transition-all">
                <h3 className="text-xl font-bold mb-4">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Unlimited companies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>Custom templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>24/7 support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9b87f5]" />
                    <span>API access</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                  onClick={handleStartFreeTrial}
                >
                  Contact Sales
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 bg-white">
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

              <Card className="p-8 bg-white">
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

              <Card className="p-8 bg-white">
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

        {/* FAQ Section */}
        <section className="py-24" id="faq">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the free trial work?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Our free trial gives you full access to all features for 14 days. No credit card required. 
                  You can upgrade to a paid plan at any time during or after the trial.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Are the documents legally compliant?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, all our templates are designed to meet UK legal requirements for dividend documentation 
                  and board meeting minutes. They are regularly reviewed by legal professionals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until 
                  the end of your current billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, we provide email support for all plans. Professional and Enterprise plans include 
                  priority support with faster response times.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-4">Dividify</h3>
                <p className="text-sm text-gray-600">
                  Simplifying dividend documentation for UK companies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>Documentation</li>
                  <li>API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} Dividify. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;

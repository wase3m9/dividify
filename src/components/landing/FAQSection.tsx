import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const FAQSection = () => {
  return (
    <section className="py-24" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <Button variant="outline" asChild>
            <Link to="/accountant-dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Accountant Dashboard
            </Link>
          </Button>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does the free trial work?</AccordionTrigger>
            <AccordionContent className="text-left">
              Our free trial gives you full access to all features for 7 days. No credit card required. 
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
  );
};
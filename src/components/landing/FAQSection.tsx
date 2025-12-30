import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const FAQSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section ref={ref as any} className="py-24" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-16"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <Accordion type="single" collapsible className="space-y-4">
            <motion.div variants={itemVariants}>
              <AccordionItem value="item-1">
                <AccordionTrigger>How does the free trial work?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Our free trial gives you full access to all features for 7 days. A credit card is required to start the trial, 
                  but you won't be charged until the 7-day trial period ends. You can cancel anytime before then.
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are the documents legally compliant?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, all our templates are designed to meet UK legal requirements for dividend documentation 
                  and board meeting minutes. They are regularly reviewed by legal professionals.
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until 
                  the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
                <AccordionContent className="text-left">
                  Yes, we provide email support for all plans. Professional and Enterprise plans include 
                  priority support with faster response times.
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

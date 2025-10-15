import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Receipt, FileArchive, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section ref={ref as any} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Everything You Need for Dividend Management
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <FileText className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Compliant Documentation</CardTitle>
                <CardDescription>
                  Ensure all documents meet HMRC and Companies House requirements
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Clock className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Time-Saving Automation</CardTitle>
                <CardDescription>
                  Generate professional documents in seconds, not hours
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Users className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Multi-Shareholder Support</CardTitle>
                <CardDescription>
                  Handle dividend distributions for multiple shareholders effortlessly
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Receipt className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Tax Compliance</CardTitle>
                <CardDescription>
                  All information required for your Self Assessment tax returns
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <FileArchive className="w-12 h-12 mb-4 text-brand-purple" />
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>
                  Maintain comprehensive records for HMRC and company law requirements
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-shadow h-full border-brand-purple/30">
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-12 h-12 text-brand-purple" />
                  <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                </div>
                <CardTitle>Accounting Integration</CardTitle>
                <CardDescription>
                  Direct integration with QuickBooks, Xero, Sage, and FreeAgent
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

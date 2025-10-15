import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  return (
    <section ref={ref as any} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Step 1 */}
          <motion.div variants={itemVariants}>
            <Card className="relative hover:shadow-lg transition-shadow h-full">
              <div className="absolute -top-3 left-6">
                <Badge className="bg-brand-purple hover:bg-brand-purple text-brand-purple-foreground">Step 1</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Enter Company Details</CardTitle>
                <CardDescription>
                  Add your company information, directors, and shareholding structure to our secure platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-xs">Estimated time: 30 seconds</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants}>
            <Card className="relative hover:shadow-lg transition-shadow h-full">
              <div className="absolute -top-3 left-6">
                <Badge className="bg-brand-purple hover:bg-brand-purple text-brand-purple-foreground">Step 2</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Generate Documents</CardTitle>
                <CardDescription>
                  Create compliant dividend vouchers and board minutes with one click using our automated system.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-xs">Estimated time: 1 minute</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants}>
            <Card className="relative hover:shadow-lg transition-shadow h-full">
              <div className="absolute -top-3 left-6">
                <Badge className="bg-brand-purple hover:bg-brand-purple text-brand-purple-foreground">Step 3</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <CardTitle>Download & File</CardTitle>
                <CardDescription>
                  Download your professional documents and maintain them in your company records for compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-xs">Estimated time: Instant</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-purple/20 via-brand-purple/40 to-brand-purple/20 -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

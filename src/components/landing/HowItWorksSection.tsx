import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";

const steps = [
  {
    icon: FileText,
    title: "Enter Company Details",
    description: "Add your company information, directors, and shareholding structure to our secure platform.",
    time: "30 seconds",
    color: "from-primary to-primary/80"
  },
  {
    icon: Upload,
    title: "Generate Documents",
    description: "Create compliant dividend vouchers and board minutes with one click using our automated system.",
    time: "1 minute",
    color: "from-primary/90 to-primary/70"
  },
  {
    icon: Download,
    title: "Download & File",
    description: "Download your professional documents and maintain them in your company records for compliance.",
    time: "Instant",
    color: "from-primary/80 to-primary/60"
  }
];

export const HowItWorksSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
      }
    }
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: [0, -10, 10, 0],
      transition: { 
        rotate: { duration: 0.5, ease: "easeInOut" as const },
        scale: { duration: 0.2 }
      }
    }
  };

  const handleCardClick = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  return (
    <section ref={ref as any} className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Quick & Easy Process
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>
        
        {/* Progress Line - Desktop */}
        <div className="hidden md:block relative mb-8">
          <div className="absolute top-8 left-[16.67%] right-[16.67%] h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/60 rounded-full"
              initial={{ width: "0%" }}
              animate={isVisible ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          {/* Step indicators on line */}
          <div className="flex justify-between px-[10%]">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="relative z-10"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.3 }}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    completedSteps.includes(index) 
                      ? 'bg-green-500 text-white' 
                      : hoveredIndex === index 
                        ? 'bg-primary text-white ring-4 ring-primary/20' 
                        : 'bg-white text-primary border-2 border-primary/20'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedSteps.includes(index) ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredIndex === index;
            const isCompleted = completedSteps.includes(index);
            
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleCardClick(index)}
                className="cursor-pointer"
              >
                <Card className={`relative h-full border-0 shadow-lg transition-all duration-500 overflow-hidden group ${
                  isHovered ? 'shadow-2xl -translate-y-2' : ''
                } ${isCompleted ? 'ring-2 ring-green-500/50' : ''}`}>
                  {/* Animated gradient background on hover */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  
                  {/* Step badge */}
                  <div className="absolute -top-0 left-6 z-10">
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={isVisible ? { y: 0, opacity: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.2 }}
                    >
                      <Badge className={`px-4 py-1.5 text-sm font-semibold shadow-lg transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500 hover:bg-green-500 text-white' 
                          : 'bg-primary hover:bg-primary text-primary-foreground'
                      }`}>
                        {isCompleted ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          `Step ${index + 1}`
                        )}
                      </Badge>
                    </motion.div>
                  </div>
                  
                  <CardHeader className="text-center pt-10 pb-4">
                    {/* Animated icon container */}
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-br from-green-500 to-green-600' 
                          : `bg-gradient-to-br ${step.color}`
                      } ${isHovered ? 'shadow-xl' : 'shadow-lg'}`}
                      variants={iconVariants}
                      animate={isHovered ? "hover" : "idle"}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <CardTitle className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center pb-6">
                    {/* Time estimate with animated icon */}
                    <motion.div 
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isHovered ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-muted-foreground'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{step.time}</span>
                    </motion.div>
                    
                    {/* Arrow indicator on hover */}
                    <motion.div 
                      className="mt-4 flex justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-primary text-sm font-medium flex items-center gap-1">
                        Click to complete <ArrowRight className="w-4 h-4" />
                      </span>
                    </motion.div>
                  </CardContent>
                  
                  {/* Bottom accent line */}
                  <motion.div 
                    className={`absolute bottom-0 left-0 h-1 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                    initial={{ width: "0%" }}
                    animate={{ width: isHovered || isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile step connector */}
        <div className="md:hidden flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div 
                  className={`w-3 h-3 rounded-full transition-colors ${
                    completedSteps.includes(index) ? 'bg-green-500' : 'bg-primary/30'
                  }`}
                  initial={{ scale: 0 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.2 }}
                />
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${
                    completedSteps.includes(index) && completedSteps.includes(index + 1) 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

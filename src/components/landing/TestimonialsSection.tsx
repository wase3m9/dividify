import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, rotateY: -15, y: 30 },
    visible: { 
      opacity: 1, 
      rotateY: 0,
      y: 0,
      transition: {
        duration: 0.6,
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
          What Our Users Say
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
            <Card className="p-6 h-full">
            <Quote className="w-8 h-8 text-brand-purple mb-4" />
            <p className="text-gray-700 mb-6">
              "Dividify has saved me hours of work. The templates are professional and the process is incredibly straightforward."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                SC
              </div>
              <div>
                <p className="font-semibold">Sarah Collins</p>
                <p className="text-sm text-gray-600">Company Director</p>
              </div>
            </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
            <Card className="p-6 h-full">
            <Quote className="w-8 h-8 text-brand-purple mb-4" />
            <p className="text-gray-700 mb-6">
              "As an accountant managing multiple clients, this tool has been a game-changer. Highly recommended!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                MP
              </div>
              <div>
                <p className="font-semibold">Michael Patterson</p>
                <p className="text-sm text-gray-600">Accountant</p>
              </div>
            </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} style={{ perspective: 1000 }}>
            <Card className="p-6 h-full">
            <Quote className="w-8 h-8 text-brand-purple mb-4" />
            <p className="text-gray-700 mb-6">
              "Finally, a solution that makes dividend management simple. The compliance features give me peace of mind."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center text-white font-bold mr-3">
                JW
              </div>
              <div>
                <p className="font-semibold">James Wilson</p>
                <p className="text-sm text-gray-600">Managing Director</p>
              </div>
            </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

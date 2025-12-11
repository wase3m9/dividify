import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureSectionProps {
  id: string;
  title: string;
  bullets: string[];
  reversed?: boolean;
  comingSoon?: boolean;
  image?: string;
  images?: string[];
}

export const FeatureSection = ({ id, title, bullets, reversed = false, comingSoon = false, image, images }: FeatureSectionProps) => {
  const hasMultipleImages = images && images.length > 1;
  const displayImages = images || (image ? [image] : []);

  return (
    <section id={id} className="py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}>
          {/* Image or Decorative Circle */}
          <div className="flex-shrink-0 w-full lg:w-1/2 flex justify-center">
            {displayImages.length > 0 ? (
              hasMultipleImages ? (
                <div className="relative flex flex-col gap-3 max-w-md w-full">
                  <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
                  {displayImages.map((img, index) => (
                    <div key={index} className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                      <img 
                        src={img} 
                        alt={`${title} - ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative max-w-lg w-full">
                  <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-purple-100/50 to-transparent rounded-3xl blur-xl" />
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <img 
                      src={displayImages[0]} 
                      alt={title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-brand-purple/20 via-brand-purple/10 to-purple-100 flex items-center justify-center mx-auto">
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-brand-purple/30 via-brand-purple/15 to-white flex items-center justify-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-purple to-purple-600" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
              {comingSoon && (
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              )}
            </div>
            <ul className="space-y-6">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-brand-purple" />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{bullet}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

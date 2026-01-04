import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import blog images
import directorsLoanImage from "@/assets/directors-loan-accounts-2025.jpg";
import salaryVsDividendsImage from "@/assets/salary-vs-dividends-2025.jpg";
import dividendWaiversImage from "@/assets/dividend-waivers-2025.jpg";
import retainedProfitsImage from "@/assets/retained-profits-vs-dividends-2025.jpg";
import dividendVoucherTemplatesImage from "@/assets/dividend-voucher-templates-header-2025.jpg";
import dividendMistakes2025 from "@/assets/dividend-mistakes-2025-new.jpg";
import createDividendVoucherGuide from "@/assets/create-dividend-voucher-guide-2025.jpg";
import dividendTaxImage from "@/assets/dividend-tax-2025-26.jpg";

interface NavigationPost {
  slug: string;
  title: string;
}

interface BlogPostNavigationProps {
  prev: NavigationPost | null;
  next: NavigationPost | null;
  currentTitle: string;
}

// Get image for a blog post based on slug
const getPostImage = (slug: string): string => {
  switch (slug) {
    case 'dividend-tax-in-2025-26-what-uk-directors-need-to-know-about-rates-and-allowances':
      return dividendTaxImage;
    case 'retained-profits-vs-dividend-payouts-how-uk-directors-should-decide-in-2025-26':
      return retainedProfitsImage;
    case 'director-loan-accounts-tax-implications-and-common-pitfalls-in-2025':
      return directorsLoanImage;
    case 'salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26':
      return salaryVsDividendsImage;
    case 'dividend-waivers-when-and-how-to-use-them-effectively':
      return dividendWaiversImage;
    case 'dividend-voucher-templates-what-uk-directors-need-to-know-in-2025':
      return dividendVoucherTemplatesImage;
    case 'dividend-mistakes-2025':
      return dividendMistakes2025;
    case 'how-to-create-dividend-voucher-step-by-step-guide':
      return createDividendVoucherGuide;
    default:
      return "/lovable-uploads/20da9f82-d7d7-4f38-8d8e-3ed01fa2a06c.png";
  }
};

export const BlogPostNavigation = ({ prev, next, currentTitle }: BlogPostNavigationProps) => {
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share && navigator.canShare) {
      try {
        await navigator.share({
          title: currentTitle,
          url,
        });
        return;
      } catch (error) {
        console.log('Native sharing failed, falling back to clipboard');
      }
    }
    
    // Fallback to clipboard
    await copyToClipboard(url);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <div className="border-t pt-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Previous Article */}
        <div className="flex-1">
          {prev ? (
            <Link 
              to={`/blog/${prev.slug}`}
              className="group block"
            >
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Previous Article
              </div>
              <div className="flex gap-3 items-start">
                <img 
                  src={getPostImage(prev.slug)} 
                  alt={prev.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow"
                />
                <div className="font-medium text-sm text-primary group-hover:text-primary/80 transition-colors leading-tight">
                  {prev.title}
                </div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Share Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Article
          </Button>
        </div>

        {/* Next Article */}
        <div className="flex-1 text-right">
          {next ? (
            <Link 
              to={`/blog/${next.slug}`}
              className="group block"
            >
              <div className="text-sm text-gray-500 mb-2 flex items-center justify-end gap-1">
                Next Article
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex gap-3 items-start justify-end">
                <div className="font-medium text-sm text-primary group-hover:text-primary/80 transition-colors leading-tight text-right">
                  {next.title}
                </div>
                <img 
                  src={getPostImage(next.slug)} 
                  alt={next.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow"
                />
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

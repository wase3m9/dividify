import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import directorsLoanImage from "@/assets/directors-loan-accounts-2025.jpg";
import salaryVsDividendsImage from "@/assets/salary-vs-dividends-2025.jpg";
import dividendWaiversImage from "@/assets/dividend-waivers-2025.jpg";
import retainedProfitsImage from "@/assets/retained-profits-vs-dividends-2025.jpg";
import dividendTax2025Image from "@/assets/dividend-tax-2025-26.jpg";
import dividendVoucherTemplatesImage from "@/assets/dividend-voucher-templates-header-2025.jpg";
import dividendVoucherDeskImage from "@/assets/dividend-voucher-desk-2025.jpg";
import dividendMistakes2025 from "@/assets/dividend-mistakes-2025-new.jpg";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  published_at: string;
}

interface BlogListProps {
  posts: BlogPost[];
  calculateReadingTime: (content: string) => number;
}

export const BlogList = ({ posts, calculateReadingTime }: BlogListProps) => {
  const handleCardClick = (slug: string) => {
    console.log('Card clicked:', slug);
    window.location.href = `/blog/${slug}`;
  };

  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <div 
          key={post.id} 
          onClick={() => handleCardClick(post.slug)}
          className="block cursor-pointer"
        >
          <Card className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4">
              <img
                src={post.slug === "dividend-tax-in-2025-26-what-uk-directors-need-to-know-about-rates-and-allowances"
                  ? "/lovable-uploads/237742a2-2257-4756-a9df-ae2a54bc113e.png"
                  : post.slug === "retained-profits-vs-dividend-payouts-how-uk-directors-should-decide-in-2025-26" 
                  ? "/lovable-uploads/20da9f82-d7d7-4f38-8d8e-3ed01fa2a06c.png"
                  : post.slug === "director-loan-accounts-tax-implications-and-common-pitfalls-in-2025" 
                  ? directorsLoanImage
                  : post.slug === "salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26"
                  ? salaryVsDividendsImage
                  : post.slug === "dividend-waivers-when-and-how-to-use-them-effectively"
                  ? dividendWaiversImage
                   : post.slug === "dividend-voucher-templates-what-uk-directors-need-to-know-in-2025"
                   ? dividendVoucherTemplatesImage
                   : post.slug === "dividend-mistakes-2025"
                   ? dividendMistakes2025
                   : dividendWaiversImage}
                alt="Blog post illustration"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <CardHeader className="p-0">
                <CardTitle>
                  <span className="text-2xl font-semibold text-[#9b87f5] hover:text-[#8b77e5] transition-colors text-left">
                    {post.title}
                  </span>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {calculateReadingTime(post.content)} min read
                  </div>
                  <span>
                    24 September 2025
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <p className="text-gray-700 line-clamp-3 text-left">
                  {post.content.substring(0, 200)}...
                </p>
                <span className="inline-block mt-4 text-[#9b87f5] hover:text-[#8b77e5] transition-colors font-medium text-left">
                  Read more →
                </span>
              </CardContent>
            </div>
          </div>
          </Card>
        </div>
      ))}
    </div>
  );
};
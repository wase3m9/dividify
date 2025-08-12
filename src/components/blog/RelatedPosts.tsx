import { Link } from "react-router-dom";
import directorsLoanImage from "@/assets/directors-loan-accounts-2025.jpg";
import salaryVsDividendsImage from "@/assets/salary-vs-dividends-2025.jpg";
import dividendWaiversImage from "@/assets/dividend-waivers-2025.jpg";
import retainedProfitsImage from "@/assets/retained-profits-vs-dividends-2025.jpg";

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  image?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) return null;

  // Function to get the correct image for each blog post slug
  const getImageForSlug = (slug: string) => {
    switch (slug) {
      case 'retained-profits-vs-dividend-payouts-how-uk-directors-should-decide-in-2025-26':
        return "/lovable-uploads/20da9f82-d7d7-4f38-8d8e-3ed01fa2a06c.png";
      case "director-loan-accounts-tax-implications-and-common-pitfalls-in-2025":
        return directorsLoanImage;
      case "salary-vs-dividends-whats-the-most-tax-efficient-mix-for-uk-directors-in-2025-26":
        return salaryVsDividendsImage;
      case "dividend-waivers-when-and-how-to-use-them-effectively":
        return dividendWaiversImage;
      case "understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025":
        return dividendWaiversImage;
      default:
        return dividendWaiversImage;
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-[#9b87f5] mb-6">Related Articles</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={getImageForSlug(post.slug)}
                alt="Blog post thumbnail"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-[#9b87f5] group-hover:text-[#7E69AB] transition-colors">
                  {post.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
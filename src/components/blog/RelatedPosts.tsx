import { Link } from "react-router-dom";
import businessDocs from "@/assets/business-documents.jpg";

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
      case "director-loan-accounts-tax-implications-and-common-pitfalls-in-2025":
        return "/src/assets/directors-loan-accounts-2025.jpg";
      case "salary-vs-dividends-whats-the-most-tax-efficient-mix-for-uk-directors-in-2025-26":
        return "/src/assets/salary-vs-dividends-2025.jpg";
      case "dividend-waivers-when-and-how-to-use-them-effectively":
        return "/src/assets/dividend-waivers-2025.jpg";
      case "understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025":
        return "/lovable-uploads/57b19283-3d8c-4363-bb49-924bb4c8c7cb.png";
      case "how-to-legally-take-dividends-from-your-limited-company":
        return "/lovable-uploads/d7b2765a-596a-46af-83a0-73cc1406247b.png";
      default:
        return "/lovable-uploads/fc2a21ca-69f6-4b6f-9407-0cf69a983c0f.png";
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
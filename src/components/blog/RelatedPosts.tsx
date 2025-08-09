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
        return "/lovable-uploads/781bd6ec-c7ea-4ce8-98a6-b679f68235aa.png";
      case "salary-vs-dividends-whats-the-most-tax-efficient-mix-for-uk-directors-in-2025-26":
        return "/lovable-uploads/83f38d36-fbfb-49c6-a098-c2a051492bb1.png";
      case "dividend-waivers-when-and-how-to-use-them-effectively":
        return "/lovable-uploads/95ceddf4-1eca-4c03-a525-31107e6bd67e.png";
      case "understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025":
        return "/lovable-uploads/57b19283-3d8c-4363-bb49-924bb4c8c7cb.png";
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
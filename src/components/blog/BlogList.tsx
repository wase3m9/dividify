import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

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
  return (
    <div className="grid gap-8">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 p-4">
              <img
                src={post.slug === "understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025" 
                  ? "/lovable-uploads/4e9e29c6-c58c-43da-86ba-368fc5f6dee7.png"
                  : post.slug === "how-to-legally-take-dividends-from-your-limited-company"
                  ? "/lovable-uploads/d7b2765a-596a-46af-83a0-73cc1406247b.png"
                  : "/lovable-uploads/fc2a21ca-69f6-4b6f-9407-0cf69a983c0f.png"}
                alt="Blog post illustration"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <CardHeader className="p-0">
                <CardTitle>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="text-2xl font-semibold text-[#9b87f5] hover:text-[#8b77e5] transition-colors text-left"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {calculateReadingTime(post.content)} min read
                  </div>
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-4">
                <p className="text-gray-700 line-clamp-3 text-left">
                  {post.content.substring(0, 200)}...
                </p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-[#9b87f5] hover:text-[#8b77e5] transition-colors font-medium text-left"
                >
                  Read more →
                </Link>
              </CardContent>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
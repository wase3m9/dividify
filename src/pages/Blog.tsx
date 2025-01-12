import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-[#9b87f5] text-left">Latest Articles</h1>
          
          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No blog posts available yet.
            </div>
          ) : (
            <div className="grid gap-8">
              {posts?.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 p-4">
                      <img
                        src="/lovable-uploads/f6751797-fe39-4802-bf9e-9ffae757f702.png"
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
                        <div className="text-sm text-gray-600 mt-2 text-left">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
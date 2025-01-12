import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
          <h1 className="text-4xl font-bold mb-8">Blog</h1>
          
          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No blog posts available yet.
            </div>
          ) : (
            <div className="grid gap-8">
              {posts?.map((post) => (
                <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="text-sm text-gray-600 mb-4">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <p className="text-gray-700">
                    {post.content.substring(0, 200)}...
                  </p>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read more →
                  </Link>
                </article>
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
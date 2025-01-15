import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogList } from "@/components/blog/BlogList";
import { Helmet } from "react-helmet";

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

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Dividify Blog | Expert Insights on Dividend Management</title>
        <meta name="description" content="Stay informed about dividend management, tax efficiency, and corporate compliance with expert insights from Dividify's knowledge base." />
        <meta name="keywords" content="dividend management, tax efficiency, corporate compliance, UK taxation, dividend vouchers" />
        <meta property="og:title" content="Dividify Blog | Expert Insights on Dividend Management" />
        <meta property="og:description" content="Stay informed about dividend management, tax efficiency, and corporate compliance with expert insights from Dividify's knowledge base." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

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
            <BlogList posts={posts} calculateReadingTime={calculateReadingTime} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
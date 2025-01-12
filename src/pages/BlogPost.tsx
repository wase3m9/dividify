import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const BlogPost = () => {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | Lovable Dividends</title>
        <meta name="description" content={post.content.substring(0, 155)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 155)} />
        <meta property="og:image" content="/lovable-uploads/f6751797-fe39-4802-bf9e-9ffae757f702.png" />
        <meta property="og:type" content="article" />
      </Helmet>

      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1 className="text-4xl font-bold text-[#9b87f5] mb-6 text-left">{post.title}</h1>
          
          <div className="mb-8">
            <img
              src="/lovable-uploads/f6751797-fe39-4802-bf9e-9ffae757f702.png"
              alt="Blog post illustration"
              className="w-1/4 h-auto rounded-lg shadow-lg float-right ml-6 mb-6"
            />
          </div>

          <div className="text-sm text-gray-600 mb-8 text-left">
            Published on {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="prose max-w-none text-left">
            {post.content.split('________________________________________').map((section, index) => (
              <div key={index} className="mb-8">
                {section.split('\n').map((paragraph, pIndex) => {
                  if (paragraph.trim().startsWith('What Are Dividends?') ||
                      paragraph.trim().startsWith('Common mistakes to Avoid') ||
                      paragraph.trim().startsWith('Why are dividends tax-efficient') ||
                      paragraph.trim().startsWith('Can you pay dividends') ||
                      paragraph.trim().startsWith('Conclusion?') ||
                      paragraph.trim().startsWith('Dividend Allowance') ||
                      paragraph.trim().startsWith('Dividend Tax Rates') ||
                      paragraph.trim().startsWith('How to Calculate') ||
                      paragraph.trim().startsWith('Tax Planning Tips') ||
                      paragraph.trim().startsWith('Final Thoughts')) {
                    return (
                      <h2 key={pIndex} className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4">
                        {paragraph}
                      </h2>
                    );
                  }
                  if (paragraph.endsWith('?') || paragraph.endsWith(':')) {
                    return (
                      <h3 key={pIndex} className="text-xl font-semibold text-[#8b77e5] mt-6 mb-3">
                        {paragraph}
                      </h3>
                    );
                  }
                  return (
                    <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
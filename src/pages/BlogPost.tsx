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
        <article className="max-w-4xl mx-auto prose lg:prose-xl text-left">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">{post.title}</h1>
          
          <div className="mb-8">
            <img
              src="/lovable-uploads/f6751797-fe39-4802-bf9e-9ffae757f702.png"
              alt="Stacks of coins showing dividend growth"
              className="w-1/3 h-auto rounded-lg shadow-lg float-right ml-6 mb-6"
            />
          </div>

          <div className="text-sm text-gray-600 mb-8">
            Published on {new Date(post.published_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="prose max-w-none">
            {post.content.split('________________________________________').map((section, index) => (
              <div key={index} className="mb-8">
                {section.split('\n').map((paragraph, pIndex) => {
                  if (paragraph.trim().startsWith('Step')) {
                    return (
                      <h2 key={pIndex} className="text-2xl font-bold text-blue-700 mt-8 mb-4">
                        {paragraph}
                      </h2>
                    );
                  }
                  if (paragraph.endsWith('?') || paragraph.endsWith(':')) {
                    return (
                      <h3 key={pIndex} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
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
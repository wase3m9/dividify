import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { AuthorProfile } from "@/components/blog/AuthorProfile";
import { BlogPostNavigation } from "@/components/blog/BlogPostNavigation";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { CommentsSection } from "@/components/blog/CommentsSection";

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

  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .neq('slug', slug)
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: navigation } = useQuery({
    queryKey: ['post-navigation', slug],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .order('published_at', { ascending: true });
      
      if (error) throw error;
      
      const currentIndex = posts.findIndex(p => p.slug === slug);
      return {
        prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
        next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
      };
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Get the first few sentences for the meta description
  const metaDescription = post.content.split('.').slice(0, 2).join('.') + '.';

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | Dividify Blog</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="dividends, tax efficiency, UK taxation, dividend vouchers, board minutes" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png" />
        <meta property="article:published_time" content={post.published_at} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <BlogPostHeader
            title={post.title}
            readingTime={readingTime}
            publishedAt={post.published_at}
            content={post.content}
          />
          
          <BlogPostContent content={post.content} slug={slug || ''} />

          <AuthorProfile
            name="James Wilson"
            title="Financial Expert & Tax Advisor"
            avatarUrl="/lovable-uploads/f6ba4012-2fdd-471e-9091-efae38d6d06a.png"
          />

          <BlogPostNavigation prev={navigation?.prev} next={navigation?.next} />

          <RelatedPosts posts={relatedPosts || []} />

          <CommentsSection />
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
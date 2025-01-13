import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Share2, Clock, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.content.substring(0, 100) + '...',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!",
          description: "You can now share this article with others.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading post...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>;
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const renderContent = (content: string) => {
    return content.split('________________________________________').map((section, index) => (
      <div key={index} className="mb-8">
        {section.split('\n').map((paragraph, pIndex) => {
          // Headers with purple color
          if (paragraph.trim().startsWith('What Are Dividends?') ||
              paragraph.trim().startsWith('Common mistakes to Avoid') ||
              paragraph.trim().startsWith('Why are dividends tax-efficient') ||
              paragraph.trim().startsWith('Can you pay dividends') ||
              paragraph.trim().startsWith('Conclusion?') ||
              paragraph.trim().startsWith('Step 1:') ||
              paragraph.trim().startsWith('Step 2:') ||
              paragraph.trim().startsWith('Step 3:') ||
              paragraph.trim().startsWith('Step 4:') ||
              paragraph.trim().startsWith('Step 5:') ||
              paragraph.trim().startsWith('Example: How Dividend Tax Works') ||
              paragraph.trim().startsWith('Reporting Dividend Income to HMRC') ||
              paragraph.trim().startsWith('Avoiding Common Mistakes')) {
            return (
              <h2 key={pIndex} className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4">
                {paragraph}
              </h2>
            );
          }

          // Darker purple for specific sections
          if (paragraph.trim().startsWith('A dividend voucher acts as proof') ||
              paragraph.trim().startsWith('As a shareholder, you must report') ||
              paragraph.trim().startsWith('Tip: Check your company')) {
            return (
              <p key={pIndex} className="mb-4 text-[#7E69AB] leading-relaxed">
                {paragraph}
              </p>
            );
          }

          // Render tax rates table
          if (paragraph.trim().startsWith('Basic Rate')) {
            return (
              <Table key={pIndex} className="my-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Band</TableHead>
                    <TableHead>Income Range</TableHead>
                    <TableHead>Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Basic Rate</TableCell>
                    <TableCell>Up to £50,270</TableCell>
                    <TableCell>8.75%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Higher Rate</TableCell>
                    <TableCell>£50,271 to £125,140</TableCell>
                    <TableCell>33.75%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Additional Rate</TableCell>
                    <TableCell>Over £125,140</TableCell>
                    <TableCell>39.35%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          }

          // Regular paragraphs
          return (
            <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | Lovable Dividends</title>
        <meta name="description" content={post.content.substring(0, 155)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 155)} />
        <meta property="og:image" content="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png" />
        <meta property="og:type" content="article" />
      </Helmet>

      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readingTime} min read
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-[#9b87f5] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <h1 className="text-4xl font-bold text-[#9b87f5] mb-6 text-left">{post.title}</h1>
          
          <div className="mb-8">
            <img
              src={slug === "understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025" 
                ? "/lovable-uploads/a996a27b-1d94-44a4-84ff-1355b4543771.png"
                : "/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png"}
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
            {renderContent(post.content)}
          </div>

          {/* Author Profile */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <img
                src="/lovable-uploads/f04dbba5-81fd-4304-b099-d3af776bc83f.png"
                alt="James Wilson"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">James Wilson</h3>
                <p className="text-gray-600">Financial Expert & Tax Advisor</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            {navigation?.prev && (
              <Link to={`/blog/${navigation.prev.slug}`} className="flex items-center gap-2 text-[#9b87f5] hover:text-[#7E69AB]">
                <ChevronLeft className="w-4 h-4" />
                Previous Article
              </Link>
            )}
            {navigation?.next && (
              <Link to={`/blog/${navigation.next.slug}`} className="flex items-center gap-2 text-[#9b87f5] hover:text-[#7E69AB] ml-auto">
                Next Article
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#9b87f5] mb-6">Related Articles</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png"
                        alt="Blog post thumbnail"
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-[#9b87f5] group-hover:text-[#7E69AB] transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#9b87f5] mb-6">Comments</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Be the first to comment</span>
              </div>
              <textarea
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
                placeholder="Share your thoughts..."
                rows={4}
              />
              <Button className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]">
                Post Comment
              </Button>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;

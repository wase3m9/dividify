
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BlogPostHeader } from "@/components/blog/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { AuthorProfile } from "@/components/blog/AuthorProfile";
import { BlogPostNavigation } from "@/components/blog/BlogPostNavigation";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { useEffect, useState } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [navigation, setNavigation] = useState<any>({ prev: null, next: null });

  useEffect(() => {
    const fetchPostData = async () => {
      // Find sample post
      const samplePost = sampleBlogPosts.find(post => post.slug === slug);
      
      if (samplePost) {
        setPost(samplePost);
        setRelatedPosts(sampleBlogPosts.filter(p => p.slug !== slug));
        
        // Create simple navigation between sample posts
        const currentIndex = sampleBlogPosts.findIndex(p => p.slug === slug);
        setNavigation({
          prev: currentIndex > 0 ? sampleBlogPosts[currentIndex - 1] : null,
          next: currentIndex < sampleBlogPosts.length - 1 ? sampleBlogPosts[currentIndex + 1] : null
        });
      } else {
        navigate('/blog');
      }
    };

    fetchPostData();
  }, [slug, navigate]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-8">Post not found</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Estimate reading time (assuming 200 words per minute)
  const wordCount = post?.content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Get the first few sentences for the meta description
  const metaDescription = post?.content?.split('.').slice(0, 2).join('.') + '.';

  // Generate structured data for the article
  const generateArticleSchema = () => {
    if (!post) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": metaDescription,
      "image": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`,
      "datePublished": post.published_at,
      "dateModified": post.published_at,
      "author": {
        "@type": "Person",
        "name": "James Wilson",
        "jobTitle": "Financial Expert & Tax Advisor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dividify",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "articleBody": post.content
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post?.title} | Dividify Blog</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="dividends, tax efficiency, UK taxation, dividend vouchers, board minutes" />
        <meta property="og:title" content={post?.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png" />
        <meta property="article:published_time" content={post?.published_at} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema())}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <article className="max-w-4xl mx-auto prose lg:prose-xl">
          <BlogPostHeader
            title={post?.title}
            readingTime={readingTime}
            publishedAt={post?.published_at}
            content={post?.content}
          />
          
          <BlogPostContent content={post?.content} slug={slug || ''} />

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

// Sample blog posts data
const sampleBlogPosts = [
  {
    id: '1',
    title: 'Understanding Dividend Taxation in the UK: A Comprehensive Guide for 2025',
    content: 'Dividends represent a share of company profits distributed to shareholders. For UK limited companies, dividends are a tax-efficient way to extract profits compared to taking a salary alone. However, understanding how dividends are taxed and ensuring compliance with HMRC requirements is essential.\n\nThe UK operates a tiered dividend tax system where the amount you pay depends on your overall income tax band. The tax-free dividend allowance for the 2024/25 tax year is £500, reduced from £1,000 in the previous year.\n\nBasic Rate (up to £50,270): 8.75%\nHigher Rate (£50,271 to £125,140): 33.75%\nAdditional Rate (over £125,140): 39.35%\n\nIt\'s important to note that these rates are lower than the equivalent income tax rates on salary, which is why dividends are considered tax-efficient.\n\nWhen taking dividends from your company, you must follow proper procedures. This includes holding a directors\' meeting to declare the dividend, recording it in company minutes, and issuing dividend vouchers to all recipients.\n\nA dividend voucher acts as proof of the dividend payment and should include the company name, date of payment, names of shareholders, and the amount paid. These records are crucial for both company compliance and individual tax reporting.\n\nAs a shareholder, you must report dividend income on your Self Assessment tax return. The tax payable depends on your overall income, and you should keep dividend vouchers as supporting evidence for at least six years.\n\nTip: Check your company has sufficient distributable profits before declaring dividends, as paying dividends from a company without adequate profits can lead to illegal "ultra vires" dividends that may need to be repaid.',
    slug: 'understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025',
    published_at: '2024-09-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'How to Legally Take Dividends from Your Limited Company',
    content: 'Taking dividends from your limited company can be a tax-efficient way to extract profits, but only when done correctly. This guide walks you through the legal process step by step.\n\nStep 1: Verify Available Profits\nBefore declaring any dividends, you must confirm your company has sufficient distributable profits. These are the accumulated profits after accounting for all expenses, liabilities, and taxes. Review your company\'s latest balance sheet or consult with your accountant to determine the available amount.\n\nStep 2: Hold a Directors\' Meeting\nEven if you\'re the sole director, formally document your decision to declare a dividend. Record the date, amount, and shareholders receiving the payment. For companies with multiple directors, a proper meeting should be held with minutes taken.\n\nStep 3: Issue Dividend Vouchers\nFor each dividend payment, create and distribute a dividend voucher to all shareholders. This document serves as an official record and should include:\n- Company name and registration number\n- Date of payment\n- Names of shareholders and their shareholdings\n- Amount of dividend paid\n- Director\'s signature\n\nStep 4: Make the Payment\nTransfer the dividend amount from your business account to the shareholders\' personal accounts. Ensure these transfers are clearly labeled as dividend payments in your accounting records.\n\nStep 5: Record in Your Accounts\nUpdate your company\'s financial records to reflect the dividend payment. This should be recorded in both your cash flow statement and as a reduction in retained earnings.\n\nCommon mistakes to Avoid:\n1. Paying dividends when the company lacks sufficient distributable profits\n2. Failing to create proper documentation (minutes and vouchers)\n3. Paying different dividend rates to shareholders with the same class of shares\n4. Not reporting dividend income on personal tax returns\n5. Mixing personal and business expenses instead of using formal dividends\n\nBy following these steps and maintaining proper documentation, you\'ll ensure your dividend payments are legal and will stand up to scrutiny from HMRC or in the event of a tax investigation.',
    slug: 'how-to-legally-take-dividends-from-your-limited-company',
    published_at: '2024-08-20T14:30:00Z'
  },
  {
    id: '3',
    title: 'Dividend Waivers: When and How to Use Them Effectively',
    content: 'Dividend waivers can be a useful tool for tax planning and business cash flow management, but they must be implemented correctly to avoid HMRC challenges. This guide explains when to consider using dividend waivers and the proper procedure for implementing them.\n\nWhat Are Dividends Waivers?\nA dividend waiver is a formal agreement where a shareholder voluntarily gives up their right to receive a dividend payment that would otherwise be due to them. This means that while other shareholders receive their dividends, the shareholder who has waived their entitlement receives nothing for that particular dividend declaration.\n\nWhy are dividends waivers used?\n- To retain funds in the business for reinvestment or working capital\n- To manage tax liabilities across shareholders\n- To accommodate shareholders with different financial needs\n- To support business succession planning\n\nHMRC Scrutiny and Settlement of Rights\nHMRC closely examines dividend waivers, particularly in family-owned companies, to ensure they\'re not being used primarily for tax avoidance. The "settlements legislation" allows HMRC to challenge arrangements where income is diverted from one person to another to reduce tax liability.\n\nCan you pay dividends to some shareholders but not others?\nWith valid dividend waivers in place, yes. However, without waivers, all shareholders of the same share class must be paid at the same rate per share.\n\nLegal Requirements for Dividend Waivers:\n1. The waiver must be executed as a formal deed\n2. It must be signed, witnessed, and dated\n3. It should be put in place before the right to the dividend arises\n4. The waiver should have genuine commercial purpose beyond tax savings\n5. It should be properly recorded in company minutes\n\nIn most cases, dividend waivers should be temporary rather than recurring. Regularly waiving dividends in favor of other family members is likely to attract HMRC attention.\n\nConclusion?\nDividend waivers can be valuable when used appropriately and with proper documentation. For significant or recurring waivers, seek professional tax advice to ensure compliance and minimize the risk of HMRC challenges.',
    slug: 'dividend-waivers-when-and-how-to-use-them-effectively',
    published_at: '2024-07-05T09:15:00Z'
  }
];

export default BlogPost;

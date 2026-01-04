import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import directorsLoanImage from "@/assets/directors-loan-accounts-2025.jpg";
import salaryVsDividendsImage from "@/assets/salary-vs-dividends-2025.jpg";
import dividendWaiversImage from "@/assets/dividend-waivers-2025.jpg";
import retainedProfitsImage from "@/assets/retained-profits-vs-dividends-2025.jpg";
import dividendVoucherTemplatesImage from "@/assets/dividend-voucher-templates-header-2025.jpg";
import dividendMistakes2025 from "@/assets/dividend-mistakes-2025-new.jpg";
import createDividendVoucherGuide from "@/assets/create-dividend-voucher-guide-2025.jpg";

interface BlogPostContentProps {
  content: string;
  slug: string;
}
export const BlogPostContent = ({
  content,
  slug
}: BlogPostContentProps) => {
  const renderContent = (content: string) => {
    return content.split('________________________________________').map((section, index) => <div key={index} className="mb-8">
        {section.split('\n').map((paragraph, pIndex) => {
        // Skip empty paragraphs
        if (!paragraph.trim()) return null;

        // Table of Contents - make it clickable
        if (paragraph.trim().startsWith('**Table of Contents**')) {
          const tocLines: string[] = [];
          const lines = section.split('\n');
          const tocStartIndex = lines.findIndex(line => line.trim().startsWith('**Table of Contents**'));
          
          // Look for bullet points only in the lines immediately following the TOC header
          // Support both - and • bullet formats
          for (let i = tocStartIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('-') || line.startsWith('•')) {
              tocLines.push(line);
            } else if (line.startsWith('**') && !line.includes('Table of Contents')) {
              // Stop when we hit the next section header
              if (tocLines.length > 0) break;
            } else if (line === '' && tocLines.length > 0) {
              // Check if the next non-empty line is a section header
              const nextNonEmpty = lines.slice(i + 1).find(l => l.trim() !== '');
              if (nextNonEmpty && nextNonEmpty.trim().startsWith('**')) break;
            }
          }

          return <div key={pIndex} className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <ul className="space-y-3">
                  {tocLines.map((tocItem, tocIndex) => {
                // Remove both - and • bullet characters
                const text = tocItem.replace(/^[-•]\s*/, '').trim();
                const anchor = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                return <li key={tocIndex}>
                          <a href={`#${anchor}`} className="text-[#9b87f5] hover:text-[#7E69AB] transition-colors duration-200 cursor-pointer text-sm" onClick={e => {
                    e.preventDefault();
                    const element = document.getElementById(anchor);
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}>
                            {text}
                          </a>
                        </li>;
              })}
                </ul>
              </div>;
        }

        // Skip TOC items when not in TOC section (both - and • bullets)
        if ((paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) && !paragraph.includes('**')) {
          return null;
        }

        // STEP HEADERS with lilac color
        if (paragraph.includes('**STEP_HEADER**') && paragraph.includes('**STEP_HEADER_END**')) {
          const headerText = paragraph.replace('**STEP_HEADER**', '').replace('**STEP_HEADER_END**', '').trim();
          const anchorId = headerText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          
          return <h2 key={pIndex} id={anchorId} className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4 pb-2 border-b-2 border-[#9b87f5]/20 scroll-mt-20">
                  {headerText}
                </h2>;
        }

        // Regular bold headers (without STEP_HEADER markers)
        if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**') && !paragraph.includes('Table of Contents')) {
          const headerText = paragraph.replace(/\*\*/g, '').trim();
          const anchorId = headerText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          
          return <h2 key={pIndex} id={anchorId} className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-brand-purple scroll-mt-20">
                  {headerText}
                </h2>;
        }


        // Darker purple for specific sections
        if (paragraph.trim().startsWith('A dividend voucher acts as proof') || paragraph.trim().startsWith('As a shareholder, you must report') || paragraph.trim().startsWith('Tip: Check your company')) {
          return <p key={pIndex} className="mb-4 text-[#7E69AB] leading-relaxed">
                {formatTextContent(paragraph)}
              </p>;
        }

        // Render tax rates table
        if (paragraph.trim().startsWith('Basic Rate')) {
          return <div key={pIndex}>
                
                <Table className="my-6">
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
              </div>;
        }

        // Regular paragraphs with formatted content
        // Convert plain "Dividify" text to link to homepage
        if (paragraph.includes('Dividify makes creating professional')) {
          const parts = paragraph.split('Dividify');
          return <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
                  {formatTextContent(parts[0])}
                  <Link to="/" className="text-[#9b87f5] hover:text-[#7E69AB] font-semibold">
                    Dividify
                  </Link>
                  {formatTextContent(parts[1])}
                </p>;
        }
        
        return <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
              {formatTextContent(paragraph)}
            </p>;
      }).filter(Boolean)}
      </div>);
  };

  // Helper to safely format bold text without dangerouslySetInnerHTML
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  // Helper function to format text content
  const formatTextContent = (text: string) => {
    const blogLinks = [
      {
        title: "Director's Loan Accounts: Tax Implications and Common Pitfalls in 2025",
        slug: "director-loan-accounts-tax-implications-and-common-pitfalls-in-2025",
      },
      {
        title: "Salary vs Dividends: What's the Most Tax-Efficient Mix for UK Directors in 2025/26?",
        slug: "salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26",
      },
    ];

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    for (const blog of blogLinks) {
      const pattern = new RegExp(
        escapeRegExp(blog.title).replace(/['']/g, "['']"),
        "g"
      );

      if (pattern.test(text)) {
        const parts = text.split(pattern);
        return (
          <span>
            {parts.map((part, index) => (
              <span key={index}>
                {formatBoldText(part)}
                {index < parts.length - 1 && (
                  <Link to={`/blog/${blog.slug}`} className="text-[#9b87f5] hover:text-[#7E69AB] underline">
                    {blog.title}
                  </Link>
                )}
              </span>
            ))}
          </span>
        );
      }
    }

    if (text.trim().startsWith("- ")) {
      const bulletText = text.replace(/^- /, "");
      return <li className="ml-4 list-disc">{formatBoldText(bulletText)}</li>;
    }

    return formatBoldText(text);
  };

  // Add full-width header image based on slug
  const getHeaderImage = (slug: string) => {
    switch (slug) {
      case 'dividend-tax-in-2025-26-what-uk-directors-need-to-know-about-rates-and-allowances':
        return "/lovable-uploads/237742a2-2257-4756-a9df-ae2a54bc113e.png";
      case 'retained-profits-vs-dividend-payouts-how-uk-directors-should-decide-in-2025-26':
        return "/lovable-uploads/20da9f82-d7d7-4f38-8d8e-3ed01fa2a06c.png";
      case 'director-loan-accounts-tax-implications-and-common-pitfalls-in-2025':
        return directorsLoanImage;
      case 'salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26':
        return salaryVsDividendsImage;
      case 'dividend-waivers-when-and-how-to-use-them-effectively':
        return dividendWaiversImage;
      case 'understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025':
        return dividendWaiversImage;
      case 'dividend-voucher-templates-what-uk-directors-need-to-know-in-2025':
        return dividendVoucherTemplatesImage;
      case 'dividend-mistakes-2025':
        return dividendMistakes2025;
      case 'how-to-create-dividend-voucher-step-by-step-guide':
        return createDividendVoucherGuide;
      default:
        return "/lovable-uploads/20da9f82-d7d7-4f38-8d8e-3ed01fa2a06c.png";
    }
  };
  return <div className="prose max-w-none text-left">
      {/* Full-width header image */}
      <div className="w-full mb-8">
        <img src={getHeaderImage(slug)} alt="Financial growth and dividend management illustration" className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg" />
      </div>
      <div className="article-content leading-relaxed space-y-6">
        {renderContent(content)}
      </div>
    </div>;
};
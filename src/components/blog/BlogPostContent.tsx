import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import directorsLoanImage from "@/assets/directors-loan-accounts-2025.jpg";
import salaryVsDividendsImage from "@/assets/salary-vs-dividends-2025.jpg";
import dividendWaiversImage from "@/assets/dividend-waivers-2025.jpg";
import retainedProfitsImage from "@/assets/retained-profits-vs-dividends-2025.jpg";
import dividendVoucherTemplatesImage from "@/assets/dividend-voucher-templates-2025.jpg";

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
        if (paragraph.trim().startsWith('**Table of Contents:**')) {
          return <div key={pIndex} className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold text-[#9b87f5] mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  {section.split('\n').filter(line => line.trim().startsWith('•')).map((tocItem, tocIndex) => {
                const text = tocItem.replace('•', '').trim();
                const anchor = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                return <li key={tocIndex}>
                          <a href={`#${anchor}`} className="text-[#9b87f5] hover:text-[#7E69AB] cursor-pointer" onClick={e => {
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

        // Skip TOC items when not in TOC section
        if (paragraph.trim().startsWith('•')) {
          return null;
        }

        // Headers with purple color and IDs for navigation - improved detection
        if ((paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**') && !paragraph.includes('Table of Contents')) ||
            // Also detect headers that are standalone without asterisks but are actual section headers
            (paragraph.trim().match(/^[A-Z][A-Za-z\s:?''""-]+$/) && 
             paragraph.trim().length < 80 && 
             !paragraph.includes('.') && 
             !paragraph.includes('•') &&
             !paragraph.startsWith('A ') &&
             !paragraph.startsWith('The ') &&
             !paragraph.startsWith('In ') &&
             !paragraph.startsWith('For ') &&
             !paragraph.startsWith('With ') &&
             !paragraph.startsWith('When ') &&
             !paragraph.startsWith('While '))) {
          const headerText = paragraph.replace(/\*\*/g, '').trim();
          const headerId = headerText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          return <h2 key={pIndex} id={headerId} className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4">
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
        return <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
              {formatTextContent(paragraph)}
            </p>;
      }).filter(Boolean)}
      </div>);
  };

  // Helper function to format text content
  const formatTextContent = (text: string) => {
    // Convert specific blog post titles to links (robust matching)
    const blogLinks = [
      {
        title: "Director's Loan Accounts: Tax Implications and Common Pitfalls in 2025",
        slug: "director-loan-accounts-tax-implications-and-common-pitfalls-in-2025",
      },
      {
        title:
          "Salary vs Dividends: What's the Most Tax-Efficient Mix for UK Directors in 2025/26?",
        slug: "salary-vs-dividends-what-s-the-most-tax-efficient-mix-for-uk-directors-in-2025-26",
      },
    ];

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const strongify = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Check if this text contains any blog post references that should be links
    for (const blog of blogLinks) {
      // Match both straight and curly apostrophes within titles
      const pattern = new RegExp(
        escapeRegExp(blog.title).replace(/['’]/g, "['’]"),
        "g"
      );

      if (pattern.test(text)) {
        const parts = text.split(pattern);
        return (
          <span>
            {parts.map((part, index) => (
              <span key={index}>
                <span
                  dangerouslySetInnerHTML={{ __html: strongify(part) }}
                />
                {index < parts.length - 1 && (
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="text-[#9b87f5] hover:text-[#7E69AB] underline"
                  >
                    {blog.title}
                  </Link>
                )}
              </span>
            ))}
          </span>
        );
      }
    }

    // Convert lines starting with - to bullet points
    if (text.trim().startsWith("- ")) {
      const bulletText = text.replace(/^- /, "");
      return (
        <li className="ml-4 list-disc">
          <span
            dangerouslySetInnerHTML={{ __html: strongify(bulletText) }}
          />
        </li>
      );
    }

    // For regular text with bold formatting
    return <span dangerouslySetInnerHTML={{ __html: strongify(text) }} />;
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
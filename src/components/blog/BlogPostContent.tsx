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
    // First, handle WARNING_BOX sections
    const processedContent = content.replace(
      /\*\*WARNING_BOX\*\*([\s\S]*?)\*\*WARNING_BOX_END\*\*/g,
      '___WARNING_BOX_START___$1___WARNING_BOX_END___'
    );

    return processedContent.split('________________________________________').map((section, index) => {
      const elements: JSX.Element[] = [];
      const lines = section.split('\n');
      let i = 0;
      let elementKey = 0;

      while (i < lines.length) {
        const paragraph = lines[i];

        // Skip empty paragraphs
        if (!paragraph.trim()) {
          i++;
          continue;
        }

        // Handle WARNING_BOX
        if (paragraph.includes('___WARNING_BOX_START___')) {
          let warningContent = paragraph.replace('___WARNING_BOX_START___', '');
          i++;
          while (i < lines.length && !lines[i].includes('___WARNING_BOX_END___')) {
            warningContent += '\n' + lines[i];
            i++;
          }
          if (i < lines.length) {
            warningContent += '\n' + lines[i].replace('___WARNING_BOX_END___', '');
            i++;
          }
          
          elements.push(
            <div key={elementKey++} className="bg-amber-50 border-l-4 border-amber-500 p-5 my-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-amber-800">
                  {warningContent.split('\n').filter(l => l.trim()).map((line, li) => (
                    <p key={li} className="mb-2 last:mb-0">{formatBoldText(line.trim())}</p>
                  ))}
                </div>
              </div>
            </div>
          );
          continue;
        }

        // Handle TIP_BOX
        if (paragraph.includes('**TIP_BOX**')) {
          let tipContent = paragraph.replace('**TIP_BOX**', '');
          i++;
          while (i < lines.length && !lines[i].includes('**TIP_BOX_END**')) {
            tipContent += '\n' + lines[i];
            i++;
          }
          if (i < lines.length) {
            tipContent += '\n' + lines[i].replace('**TIP_BOX_END**', '');
            i++;
          }
          
          elements.push(
            <div key={elementKey++} className="bg-emerald-50 border-l-4 border-emerald-500 p-5 my-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="text-emerald-800">
                  {tipContent.split('\n').filter(l => l.trim()).map((line, li) => (
                    <p key={li} className="mb-2 last:mb-0">{formatBoldText(line.trim())}</p>
                  ))}
                </div>
              </div>
            </div>
          );
          continue;
        }

        // Handle INFO_BOX
        if (paragraph.includes('**INFO_BOX**')) {
          let infoContent = paragraph.replace('**INFO_BOX**', '');
          i++;
          while (i < lines.length && !lines[i].includes('**INFO_BOX_END**')) {
            infoContent += '\n' + lines[i];
            i++;
          }
          if (i < lines.length) {
            infoContent += '\n' + lines[i].replace('**INFO_BOX_END**', '');
            i++;
          }
          
          elements.push(
            <div key={elementKey++} className="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-blue-800">
                  {infoContent.split('\n').filter(l => l.trim()).map((line, li) => (
                    <p key={li} className="mb-2 last:mb-0">{formatBoldText(line.trim())}</p>
                  ))}
                </div>
              </div>
            </div>
          );
          continue;
        }

        // Table of Contents
        if (paragraph.trim().match(/^\*\*Table of Contents\*?\*?:?\*?\*?$/i) || paragraph.trim().startsWith('**Table of Contents**') || paragraph.trim().startsWith('**Table of Contents:**')) {
          const tocLines: string[] = [];
          const tocStartIndex = i;
          
          for (let j = tocStartIndex + 1; j < lines.length; j++) {
            const line = lines[j].trim();
            if (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+\./)) {
              tocLines.push(line);
            } else if (line.startsWith('**') && !line.includes('Table of Contents')) {
              if (tocLines.length > 0) break;
            } else if (line === '' && tocLines.length > 0) {
              const nextNonEmpty = lines.slice(j + 1).find(l => l.trim() !== '');
              if (nextNonEmpty && nextNonEmpty.trim().startsWith('**')) break;
            }
          }

          elements.push(
            <div key={elementKey++} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl mb-8 border border-purple-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {tocLines.map((tocItem, tocIndex) => {
                  const text = tocItem.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
                  const anchor = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                  return (
                    <li key={tocIndex} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <a
                        href={`#${anchor}`}
                        className="text-gray-700 hover:text-primary transition-colors duration-200 cursor-pointer text-sm hover:underline"
                        onClick={e => {
                          e.preventDefault();
                          const element = document.getElementById(anchor);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
          i++;
          continue;
        }

        // Skip TOC items when not in TOC section
        if ((paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) && !paragraph.includes('**')) {
          i++;
          continue;
        }

        // STEP HEADERS
        if (paragraph.includes('**STEP_HEADER**') || paragraph.includes('STEP_HEADER')) {
          let headerText = paragraph
            .replace('**STEP_HEADER**', '')
            .replace('**STEP_HEADER_END**', '')
            .replace('STEP_HEADER', '')
            .replace('STEP_HEADER_END', '')
            .replace(/\*\*/g, '')
            .trim();
          const anchorId = headerText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          
          elements.push(
            <h2 key={elementKey++} id={anchorId} className="text-2xl font-bold text-primary mt-10 mb-5 pb-3 border-b-2 border-primary/20 scroll-mt-20 flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
              {headerText}
            </h2>
          );
          i++;
          continue;
        }

        // Regular bold headers
        if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**') && !paragraph.includes('Table of Contents')) {
          const headerText = paragraph.replace(/\*\*/g, '').trim();
          const anchorId = headerText.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          
          elements.push(
            <h2 key={elementKey++} id={anchorId} className="text-2xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b-2 border-primary scroll-mt-20">
              {headerText}
            </h2>
          );
          i++;
          continue;
        }

        // Handle numbered lists
        if (paragraph.trim().match(/^\d+\.\s/)) {
          const listItems: string[] = [paragraph];
          i++;
          while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
            listItems.push(lines[i]);
            i++;
          }
          
          elements.push(
            <ol key={elementKey++} className="list-decimal list-outside ml-6 my-4 space-y-2">
              {listItems.map((item, li) => (
                <li key={li} className="text-gray-700 leading-relaxed pl-2">
                  {formatBoldText(item.replace(/^\d+\.\s/, ''))}
                </li>
              ))}
            </ol>
          );
          continue;
        }

        // Handle bullet lists
        if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
          const listItems: string[] = [paragraph];
          i++;
          while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('• '))) {
            listItems.push(lines[i]);
            i++;
          }
          
          elements.push(
            <ul key={elementKey++} className="list-disc list-outside ml-6 my-4 space-y-2">
              {listItems.map((item, li) => (
                <li key={li} className="text-gray-700 leading-relaxed pl-2">
                  {formatBoldText(item.replace(/^[-•]\s/, ''))}
                </li>
              ))}
            </ul>
          );
          continue;
        }

        // Render tax rates table
        if (paragraph.trim().startsWith('Basic Rate')) {
          elements.push(
            <div key={elementKey++} className="my-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary">
                    <TableHead className="text-white font-semibold">Tax Band</TableHead>
                    <TableHead className="text-white font-semibold">Income Range</TableHead>
                    <TableHead className="text-white font-semibold">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-white hover:bg-gray-50">
                    <TableCell className="font-medium">Basic Rate</TableCell>
                    <TableCell>Up to £50,270</TableCell>
                    <TableCell className="font-semibold text-primary">8.75%</TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-50 hover:bg-gray-100">
                    <TableCell className="font-medium">Higher Rate</TableCell>
                    <TableCell>£50,271 to £125,140</TableCell>
                    <TableCell className="font-semibold text-primary">33.75%</TableCell>
                  </TableRow>
                  <TableRow className="bg-white hover:bg-gray-50">
                    <TableCell className="font-medium">Additional Rate</TableCell>
                    <TableCell>Over £125,140</TableCell>
                    <TableCell className="font-semibold text-primary">39.35%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          );
          i++;
          continue;
        }

        // Dividify link
        if (paragraph.includes('Dividify makes creating professional')) {
          const parts = paragraph.split('Dividify');
          elements.push(
            <p key={elementKey++} className="mb-4 text-gray-700 leading-relaxed text-lg">
              {formatTextContent(parts[0])}
              <Link to="/" className="text-primary hover:text-primary/80 font-semibold">
                Dividify
              </Link>
              {formatTextContent(parts[1])}
            </p>
          );
          i++;
          continue;
        }
        
        // Regular paragraphs
        elements.push(
          <p key={elementKey++} className="mb-4 text-gray-700 leading-relaxed text-lg">
            {formatTextContent(paragraph)}
          </p>
        );
        i++;
      }

      return <div key={index} className="mb-8">{elements}</div>;
    });
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
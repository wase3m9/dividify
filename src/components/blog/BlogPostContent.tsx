import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

        // Headers with purple color and IDs for navigation
        if (paragraph.trim().startsWith('What Are Dividends?') || paragraph.trim().startsWith('Common mistakes to Avoid') || paragraph.trim().startsWith('Why are dividends tax-efficient') || paragraph.trim().startsWith('Can you pay dividends') || paragraph.trim().startsWith('Conclusion?') || paragraph.trim().startsWith('Step 1:') || paragraph.trim().startsWith('Step 2:') || paragraph.trim().startsWith('Step 3:') || paragraph.trim().startsWith('Step 4:') || paragraph.trim().startsWith('Step 5:') || paragraph.trim().startsWith('Example: How Dividend Tax Works') || paragraph.trim().startsWith('Reporting Dividend Income to HMRC') || paragraph.trim().startsWith('Avoiding Common Mistakes') || paragraph.trim().startsWith('2025/26 Dividend Tax Rates') || paragraph.trim().startsWith('The Dividend Allowance') || paragraph.trim().startsWith('Tax Planning Strategies') || paragraph.trim().startsWith('When Waivers Make Commercial Sense') || paragraph.trim().startsWith('HMRC Scrutiny and Settlement') || paragraph.trim().startsWith('Legal Requirements for Dividend Waivers') || paragraph.trim().startsWith('Real-World Scenario') || paragraph.trim().startsWith('The Formal Process') || paragraph.trim().startsWith('Risks if Done Incorrectly') || paragraph.trim().startsWith('Why This Matters to UK Company Directors') || paragraph.trim().startsWith('HMRC and Companies House Implications') || paragraph.trim().startsWith('Formal Process and Legal Advice') || paragraph.trim().startsWith('FAQ Section')) {
          const headerId = paragraph.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
          return <h2 key={pIndex} id={headerId} className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4">
                {paragraph}
              </h2>;
        }

        // Add the new image after Step 3
        if (paragraph.trim().startsWith('Step 3:') && slug === 'how-to-legally-take-dividends-from-your-limited-company') {
          return <>
                <h2 key={`${pIndex}-header`} id="step-3-issue-dividend-vouchers" className="text-2xl font-bold text-[#9b87f5] mt-8 mb-4">
                  {paragraph}
                </h2>
                <div key={`${pIndex}-image`} className="my-8">
                  <img src="/lovable-uploads/8a6a36c3-2cd1-4d16-9874-d000294e732f.png" alt="Financial growth chart showing increasing profits and dividends" className="w-2/3 mx-auto rounded-lg shadow-lg" />
                </div>
              </>;
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
    // Convert **text** to bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert lines starting with - to bullet points
    if (text.trim().startsWith('- ')) {
      const bulletText = text.replace(/^- /, '');
      return <li className="ml-4 list-disc">
          <span dangerouslySetInnerHTML={{
          __html: bulletText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        }} />
        </li>;
    }

    // For regular text with bold formatting
    return <span dangerouslySetInnerHTML={{
      __html: formatted
    }} />;
  };

  // Add full-width header image based on slug
  const getHeaderImage = (slug: string) => {
    switch (slug) {
      case 'understanding-dividend-taxation-in-the-uk-a-comprehensive-guide-for-2025':
        return '/lovable-uploads/57b19283-3d8c-4363-bb49-924bb4c8c7cb.png';
      case 'how-to-legally-take-dividends-from-your-limited-company':
        return '/lovable-uploads/8a6a36c3-2cd1-4d16-9874-d000294e732f.png';
      case 'dividend-waivers-when-and-how-to-use-them-effectively':
        return '/lovable-uploads/bda6c9ee-0f6f-495c-abca-817d5287b0ba.png';
      default:
        return '/lovable-uploads/57b19283-3d8c-4363-bb49-924bb4c8c7cb.png';
    }
  };
  return <div className="prose max-w-none text-left">
      {/* Full-width header image */}
      <div className="w-full mb-8 -mx-4">
        <img src={getHeaderImage(slug)} alt="Financial growth and dividend management illustration" className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg" />
      </div>
      {renderContent(content)}
    </div>;
};
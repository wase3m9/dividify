import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlogPostContentProps {
  content: string;
  slug: string;
}

export const BlogPostContent = ({ content, slug }: BlogPostContentProps) => {
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
    <div className="prose max-w-none text-left">
      <div className="mb-8">
        <img
          src="/lovable-uploads/95ceddf4-1eca-4c03-a525-31107e6bd67e.png"
          alt="Blog post illustration showing stacks of coins representing dividend growth"
          className="w-1/4 h-auto rounded-lg shadow-lg float-right ml-6 mb-6"
        />
      </div>
      {renderContent(content)}
    </div>
  );
};
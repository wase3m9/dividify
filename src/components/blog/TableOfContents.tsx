interface TableOfContentsProps {
  slug: string;
}

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tableOfContentsData: Record<string, TOCItem[]> = {
  "dividend-mistakes-2025": [
    { id: "why-this-matters", title: "Why this matters to UK company directors", level: 1 },
    { id: "mistake-1", title: "Mistake #1: Paying dividends without distributable profits", level: 1 },
    { id: "mistake-2", title: "Mistake #2: Missing paperwork (vouchers & board minutes)", level: 1 },
    { id: "mistake-3", title: "Mistake #3: \"What's in the bank?\" withdrawals", level: 1 },
    { id: "mistake-4", title: "Mistake #4: Forgetting to plan for the personal tax bill", level: 1 },
    { id: "mistake-5", title: "Mistake #5: Unequal dividends without the right share structure", level: 1 },
    { id: "best-practice", title: "Best-practice checklist for 2025/26", level: 1 },
    { id: "faqs", title: "FAQs", level: 1 }
  ],
  "dividend-voucher-templates-what-uk-directors-need-to-know-in-2025": [
    { id: "why-dividend-vouchers-matter", title: "Why dividend vouchers matter for UK company directors", level: 1 },
    { id: "dividend-voucher-requirements", title: "Dividend voucher requirements explained", level: 1 },
    { id: "template-options", title: "Different dividend voucher template options (PDF, Word, Excel)", level: 1 },
    { id: "step-by-step", title: "Step-by-step: How to produce dividend vouchers", level: 1 },
    { id: "dividend-voucher-example", title: "Dividend voucher example (what it looks like)", level: 1 },
    { id: "common-mistakes", title: "Common mistakes directors make with dividend vouchers", level: 1 },
    { id: "best-practice-tips", title: "Best practice tips for 2025/26", level: 1 },
    { id: "faqs", title: "FAQs", level: 1 }
  ]
};

export const TableOfContents = ({ slug }: TableOfContentsProps) => {
  const tocItems = tableOfContentsData[slug] || [];

  if (tocItems.length === 0) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-400">
        Table of contents
      </h2>
      <nav>
        <ol className="space-y-3">
          {tocItems.map((item, index) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className="text-left text-primary hover:text-primary/80 hover:underline transition-colors text-sm leading-relaxed w-full text-left"
              >
                <span className="text-gray-700 mr-2">{index + 1}.</span>
                <span className="text-primary">{item.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
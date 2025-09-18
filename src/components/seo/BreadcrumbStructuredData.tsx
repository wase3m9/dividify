import { Helmet } from "react-helmet";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[];
}

export const BreadcrumbStructuredData = ({ breadcrumbs }: BreadcrumbStructuredDataProps) => {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && {
        "item": `${window.location.origin}${item.href}`
      })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
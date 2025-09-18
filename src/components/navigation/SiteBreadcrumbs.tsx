import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { BreadcrumbStructuredData } from "@/components/seo/BreadcrumbStructuredData";

interface SiteBreadcrumbsProps {
  additionalBreadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export const SiteBreadcrumbs = ({ additionalBreadcrumbs = [], className }: SiteBreadcrumbsProps) => {
  const { breadcrumbs } = useBreadcrumbs();
  
  // Merge generated breadcrumbs with additional ones
  const allBreadcrumbs = [...breadcrumbs, ...additionalBreadcrumbs];
  
  // Don't show breadcrumbs if we only have "Home" or are on the home page
  if (allBreadcrumbs.length <= 1) {
    return null;
  }

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={allBreadcrumbs} />
      <Breadcrumb className={className}>
        <BreadcrumbList>
          {allBreadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index === 0 ? (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={item.href || "/"} className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.href && index < allBreadcrumbs.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
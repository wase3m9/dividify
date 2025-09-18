import { useLocation, useSearchParams } from "react-router-dom";
import { useUserTypeRouting } from "@/hooks/useUserTypeRouting";
import { useCompanyData } from "@/hooks/useCompanyData";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const useBreadcrumbs = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { profile } = useUserTypeRouting();
  const { selectedCompany } = useCompanyData();
  
  const companyId = searchParams.get('companyId');
  const companyName = selectedCompany?.name || 'Company';

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ];

    const path = location.pathname;
    const isAccountant = profile?.user_type === 'accountant';

    switch (path) {
      case '/features':
        breadcrumbs.push({ label: "Features" });
        break;

      case '/auth':
        breadcrumbs.push({ label: "Sign In" });
        break;

      case '/signup':
        breadcrumbs.push({ label: "Sign Up" });
        break;

      case '/company-dashboard':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        }
        breadcrumbs.push({ label: companyName });
        break;

      case '/accountant-dashboard':
        breadcrumbs.push({ label: "Accountant Dashboard" });
        break;

      case '/profile':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        breadcrumbs.push({ label: "Profile" });
        break;

      case '/dividend-voucher-form':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Create Dividend Voucher" });
        break;

      case '/dividend-amount-form':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Dividend Amount Form" });
        break;

      case '/dividend-template':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Dividend Template" });
        break;

      case '/board-minutes-form':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Board Minutes Form" });
        break;

      case '/board-minutes-template':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Board Minutes Template" });
        break;

      case '/board-minutes-preview':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        if (companyId) {
          breadcrumbs.push({ label: companyName, href: `/company-dashboard?companyId=${companyId}` });
        }
        breadcrumbs.push({ label: "Board Minutes", href: "/board-minutes-form" });
        breadcrumbs.push({ label: "Preview" });
        break;

      case '/dividend-waivers':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        breadcrumbs.push({ label: "Dividend Waivers" });
        break;

      case '/journal-entries':
        if (isAccountant) {
          breadcrumbs.push({ label: "Accountant Dashboard", href: "/accountant-dashboard" });
        } else {
          breadcrumbs.push({ label: "Company Dashboard", href: "/company-dashboard" });
        }
        breadcrumbs.push({ label: "Journal Entries" });
        break;

      case '/accountants':
        breadcrumbs.push({ label: "For Accountants" });
        break;

      case '/get-started':
        breadcrumbs.push({ label: "Get Started" });
        break;

      case '/contact':
        breadcrumbs.push({ label: "Contact" });
        break;

      case '/blog':
        breadcrumbs.push({ label: "Blog" });
        break;

      case '/api':
      case '/documentation':
        breadcrumbs.push({ label: "API Documentation" });
        break;

      case '/privacy':
      case '/privacy-policy':
        breadcrumbs.push({ label: "Privacy Policy" });
        break;

      case '/terms':
      case '/terms-of-service':
        breadcrumbs.push({ label: "Terms of Service" });
        break;

      case '/cookies':
      case '/cookie-policy':
        breadcrumbs.push({ label: "Cookie Policy" });
        break;

      default:
        // Handle blog post URLs
        if (path.startsWith('/blog/')) {
          breadcrumbs.push({ label: "Blog", href: "/blog" });
          // The specific blog post title will be handled by the BlogPost component
        }
        break;
    }

    return breadcrumbs;
  };

  return {
    breadcrumbs: generateBreadcrumbs(),
    generateBreadcrumbs
  };
};
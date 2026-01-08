import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const PRODUCTION_DOMAIN = "https://dividify.co.uk";

interface ProductionCanonicalProps {
  children?: React.ReactNode;
}

/**
 * Ensures canonical URLs always point to production domain
 * and adds noindex for staging/non-production domains
 */
export const ProductionCanonical = ({ children }: ProductionCanonicalProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isProductionDomain = typeof window !== 'undefined' && 
    window.location.hostname === 'dividify.co.uk';
  
  const canonicalUrl = `${PRODUCTION_DOMAIN}${pathname === '/' ? '' : pathname}`;

  return (
    <Helmet>
      {!isProductionDomain && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <link rel="canonical" href={canonicalUrl} />
      {children}
    </Helmet>
  );
};

export const getProductionUrl = (path: string = '') => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${PRODUCTION_DOMAIN}${cleanPath === '/' ? '' : cleanPath}`;
};

export { PRODUCTION_DOMAIN };

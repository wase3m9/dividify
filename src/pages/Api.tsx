import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Footer } from "@/components/landing/Footer";

const Api = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dividify API Documentation | Integrate Dividend Software | UK Developers</title>
        <meta name="description" content="Integrate Dividify's dividend voucher and board minutes generation into your applications. API documentation for UK developers and accounting software." />
        <meta name="keywords" content="dividend API, accounting software API, UK tax software integration, dividend voucher API, board minutes API" />
        <meta name="geo.region" content="GB" />
        <meta name="geo.country" content="UK" />
        <meta property="og:title" content="Dividify API Documentation | Integrate Dividend Software" />
        <meta property="og:description" content="Integrate Dividify's dividend voucher and board minutes generation into your applications." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/api`} />
        <meta property="og:locale" content="en_GB" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Dividify API Documentation" />
        <meta name="twitter:description" content="Integrate dividend voucher generation into your applications with our comprehensive API." />
        <link rel="canonical" href={`${window.location.origin}/api`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": "Dividify API Documentation",
            "description": "Complete REST API documentation for Dividify's dividend voucher and board minutes generation service",
            "author": {
              "@type": "Organization",
              "name": "Dividify",
              "url": window.location.origin
            },
            "publisher": {
              "@type": "Organization",
              "name": "Dividify",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/lovable-uploads/e4cf415e-3cbf-4e3b-9378-b22b2a036b60.png`
              }
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-01-17",
            "url": window.location.href,
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Dividify API",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "GBP"
              }
            }
          })}
        </script>
      </Helmet>
      
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Dividify API Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Integrate UK dividend voucher and board minutes generation into your accounting applications
              </p>
            </div>

            <div className="grid gap-8">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Getting Started</h2>
                <p className="text-muted-foreground">
                  To use our API, you'll need to authenticate your requests using an API key. 
                  Contact our support team to get your API credentials.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </section>

              <ScrollArea className="h-[400px] rounded-md border p-6">
                <section className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Authentication</h3>
                    <p className="text-muted-foreground mb-4">
                      All API requests must include your API key in the Authorization header:
                    </p>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Base URL</h3>
                    <p className="text-muted-foreground mb-4">
                      All API requests should be made to:
                    </p>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>
                        https://api.dividify.com/v1
                      </code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Rate Limits</h3>
                    <p className="text-muted-foreground">
                      Our API is rate limited to ensure fair usage:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-muted-foreground">
                      <li>Free tier: 100 requests per hour</li>
                      <li>Professional tier: 1,000 requests per hour</li>
                      <li>Enterprise tier: Custom limits</li>
                    </ul>
                  </div>
                </section>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Api;
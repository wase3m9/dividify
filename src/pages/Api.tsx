import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const Api = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
              <p className="text-xl text-muted-foreground">
                Integrate Dividify's powerful features into your applications
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
    </div>
  );
};

export default Api;
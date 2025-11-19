import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Cookie Policy | Dividify - How We Use Cookies</title>
        <meta name="description" content="Learn how Dividify uses cookies to improve your experience and comply with UK regulations." />
        <link rel="canonical" href={`${window.location.origin}/cookies`} />
        <meta property="og:title" content="Cookie Policy | Dividify" />
        <meta property="og:description" content="How we use cookies and comply with UK regulations" />
        <meta property="og:url" content={`${window.location.origin}/cookies`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${window.location.origin}/lovable-uploads/15c0aa90-4fcb-4507-890a-a06e5dfcc6da.png`} />
      </Helmet>
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p className="mb-6">
            Cookies are small text files that are stored on your computer or mobile device when you visit our website.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="mb-4">
            We use cookies to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Remember your preferences</li>
            <li>Understand how you use our website</li>
            <li>Improve our services</li>
            <li>Provide personalized content</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Essential cookies: Required for the website to function</li>
            <li>Analytics cookies: Help us understand how visitors interact with our website</li>
            <li>Functional cookies: Remember your preferences</li>
            <li>Marketing cookies: Track your activity across websites</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <p className="mb-6">
            You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
          <p className="mb-6">
            We may update this Cookie Policy from time to time. Please check back regularly for any updates.
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-6">
            If you have any questions about our Cookie Policy, please contact us at:
            <br />
            Email: info@dividify.co.uk
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
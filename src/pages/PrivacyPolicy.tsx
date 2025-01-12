import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-6">
            Welcome to Dividify ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Company information</li>
            <li>Financial and transaction data</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you important updates</li>
            <li>Improve our services</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-6">
            We implement appropriate security measures to protect your personal information.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-6">
            For any questions about this Privacy Policy, please contact us at:
            <br />
            Email: info@dividify.co.uk
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
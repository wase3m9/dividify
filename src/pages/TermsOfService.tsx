import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-left">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p className="mb-6">
            By accessing or using Dividify, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-6">
            Dividify provides dividend management and documentation services for businesses.
          </p>

          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-6">
            You are responsible for maintaining the security of your account and any activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
          <p className="mb-6">
            Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable.
          </p>

          <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
          <p className="mb-6">
            All content and materials available on Dividify are protected by intellectual property rights.
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-6">
            Dividify shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
          <p className="mb-6">
            We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of any changes.
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
          <p className="mb-6">
            For any questions about these Terms, please contact us at:
            <br />
            Email: info@dividify.co.uk
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
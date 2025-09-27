import { SetupAdminAccountsButton } from "@/components/admin/SetupAdminAccountsButton";

const DevAdminSetup = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Developer Admin Setup</h1>
        
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Setup Admin Accounts</h2>
            <p className="text-gray-600 mb-4">
              This will setup admin access for the specified email addresses with temporary passwords.
            </p>
            <SetupAdminAccountsButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevAdminSetup;
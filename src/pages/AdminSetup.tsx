import { CreateAdminButton } from "@/components/admin/CreateAdminButton";
import { AdminRoleManager } from "@/components/admin/AdminRoleManager";

const AdminSetup = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Setup</h1>
        
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Create Initial Admin</h2>
            <p className="text-gray-600 mb-4">
              This will create an admin user with email: wase3m@hotmail.com
            </p>
            <CreateAdminButton />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Admin Role Manager</h2>
            <AdminRoleManager />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
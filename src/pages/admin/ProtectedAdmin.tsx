import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminLayout } from "@/components/AdminLayout";

export const ProtectedAdmin = () => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Navigation handled by useAdminCheck
  }

  return <AdminLayout />;
};

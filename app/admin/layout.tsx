import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth-helpers/server";
import { redirect } from "next/navigation";

type ExtendedSession = {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth()) as ExtendedSession | null;

  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-50 p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">{session.user.name}</p>
        </div>
        <nav className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/vendors">Vendors</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/products">Products</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/orders">Orders</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/banners">Banners</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/users">Users</Link>
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
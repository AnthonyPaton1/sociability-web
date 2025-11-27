import { Metadata } from "next";
import { getAllVendors } from "@/lib/actions/admin.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vendors Management",
};

export default async function AdminVendorsPage() {
  const result = await getAllVendors();

  if (!result.success || !result.data) {
    return <div>Error loading vendors</div>;
  }
  type VendorWithStats = {
  id: string;
  vendorId: string;
  businessName: string;
  name: string;
  email: string;
  createdAt: Date;
  productCount: number;
  orderCount: number;
  totalRevenue: number;
};

  const vendors = result.data;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Vendors</h1>
        <p className="text-muted-foreground">
          Manage all vendors on the platform
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No vendors yet
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor: VendorWithStats) => (
                <TableRow key={vendor.id}>
                  <TableCell>{formatId(vendor.vendorId || vendor.id)}</TableCell>
                  <TableCell className="font-medium">
                    {vendor.name || "N/A"}
                  </TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.productCount}</TableCell>
                  <TableCell>{vendor.orderCount}</TableCell>
                  <TableCell>{formatCurrency(vendor.totalRevenue)}</TableCell>
                  <TableCell>
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/vendors/${vendor.vendorId}`}>
                        View Dashboard
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
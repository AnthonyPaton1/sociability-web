import { requireVendorAccess } from "@/lib/auth/requireVendorAccess";
import { Metadata } from "next";
import { getVendorCustomers } from "@/lib/actions/user.actions"; // New function
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatId } from "@/lib/utils";
import Pagination from "@/components/shared/pagination";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Customers",
};

const VendorCustomersPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ vendorId: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const { page = '1' } = await searchParams;
  const { vendorId } = await params;
  await requireVendorAccess(vendorId);
  
  // Get only customers who have ordered from this vendor
  const customers = await getVendorCustomers({ vendorId, page: Number(page) });

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Customers</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
  <TableRow>
    <TableHead>ID</TableHead>
    <TableHead>NAME</TableHead>
    <TableHead>EMAIL</TableHead>
    <TableHead>TOTAL ORDERS</TableHead>
    <TableHead>RECENT ORDERS</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {customers.data.length === 0 ? (
    <TableRow>
      <TableCell colSpan={5} className="text-center">
        No customers yet
      </TableCell>
    </TableRow>
  ) : (
    customers.data.map((customer) => (
      <TableRow key={customer.id}>
        <TableCell>{formatId(customer.id)}</TableCell>
        <TableCell>{customer.name}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.orderCount}</TableCell>
        <TableCell>
          <div className="space-y-1 text-sm">
            {customer.orders.map((order) => (
              <div key={order.id} className="flex items-center gap-2">
                <Link 
                  href={`/vendors/${vendorId}/orders/${order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {formatId(order.id)}
                </Link>
                <span className="text-muted-foreground">
                  {formatCurrency(order.totalPrice)}
                </span>
                <span className={order.isPaid ? "text-green-600" : "text-amber-600"}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
        </Table>
        {customers.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={customers.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default VendorCustomersPage;

import { Metadata } from "next";
import { getAllBanners } from "@/lib/actions/advertising.actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatId } from "@/lib/utils";
import BannerToggleButton from "@/components/admin/banner-toggle-button";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteBanner } from "@/lib/actions/advertising.actions";

export const metadata: Metadata = {
  title: "Banner Management",
};

export default async function AdminBannersPage() {
  const result = await getAllBanners();

  if (!result.success || !result.data) {
    return <div>Error loading banners</div>;
  }

  const banners = result.data;
  const activeBannerCount = banners.filter((b) => b.isActive).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">
            Manage homepage carousel banners ({activeBannerCount}/4 active)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/banners/new">Create Banner</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No banners yet. Create your first banner to get started.
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="relative h-16 w-24">
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{formatId(banner.id)}</TableCell>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {banner.link.substring(0, 30)}...
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No link</span>
                    )}
                  </TableCell>
                  <TableCell>{banner.order}</TableCell>
                  <TableCell>
                    <BannerToggleButton
                      id={banner.id}
                      isActive={banner.isActive}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/banners/${banner.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <DeleteDialog id={banner.id} action={deleteBanner} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {activeBannerCount >= 4 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> You have reached the maximum of 4 active
            banners. Deactivate a banner before activating another.
          </p>
        </div>
      )}
    </div>
  );
}
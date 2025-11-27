import { Metadata } from "next";
import BannerForm from "@/components/admin/banner-form";
import { getBannerById } from "@/lib/actions/advertising.actions";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Banner",
};

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getBannerById(id);

  if (!banner) {
    notFound();
  }

  // Convert null to undefined for TypeScript
  const bannerData = {
    ...banner,
    link: banner.link || undefined,
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Edit Banner</h1>
        <p className="text-muted-foreground">Update banner details</p>
      </div>

      <BannerForm type="Update" banner={bannerData} />
    </div>
  );
}
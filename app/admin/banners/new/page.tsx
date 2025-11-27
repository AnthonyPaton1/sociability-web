import { Metadata } from "next";
import BannerForm from "@/components/admin/banner-form";

export const metadata: Metadata = {
  title: "Create Banner",
};

export default function CreateBannerPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Create Banner</h1>
        <p className="text-muted-foreground">
          Add a new banner to the homepage carousel (max 4 active)
        </p>
      </div>

      <BannerForm type="Create" />
    </div>
  );
}
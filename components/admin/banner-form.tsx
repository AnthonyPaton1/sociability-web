"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBanner, updateBanner } from "@/lib/actions/advertising.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";

const bannerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  image: z.string().url("Must be a valid image URL"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.coerce.number().min(0, "Order must be 0 or greater"),
  isActive: z.boolean().optional(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export default function BannerForm({
  type,
  banner,
}: {
  type: "Create" | "Update";
  banner?: BannerFormValues;
}) {
  const router = useRouter();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner || {
      title: "",
      image: "",
      link: "",
      order: 0,
      isActive: true,
    },
  });

  const image = form.watch("image");

const onSubmit = async (values: BannerFormValues) => {
  try {
    if (type === "Update" && !values.id) {
      toast.error("Banner ID is required for update");
      return;
    }

    const result =
      type === "Create"
        ? await createBanner(values)
        : await updateBanner(values as Required<Pick<BannerFormValues, 'id'>> & BannerFormValues);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      router.push("/admin/banners");
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred");
  }
};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Title</FormLabel>
              <FormControl>
                <Input placeholder="Summer Sale 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {image ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={image}
                        alt="Banner preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => form.setValue("image", "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                   <UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    if (res && res[0]) {
      form.setValue("image", res[0].url);
      toast.success("Image uploaded successfully");
    }
  }}
  onUploadError={(error: Error) => {
    toast.error(error.message);
  }}
/>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/sale"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : type === "Create"
              ? "Create Banner"
              : "Update Banner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/banners")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
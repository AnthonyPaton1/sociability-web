"use client";

import { toggleBannerActive } from "@/lib/actions/advertising.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";

export default function BannerToggleButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();

 const handleToggle = () => {
  startTransition(async () => {
    const result = await toggleBannerActive(id, !isActive);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  });
};

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      variant={isActive ? "default" : "outline"}
      size="sm"
    >
      {isPending ? "..." : isActive ? "Active" : "Inactive"}
    </Button>
  );
}
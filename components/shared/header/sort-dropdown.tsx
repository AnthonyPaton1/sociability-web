"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "lowest" },
  { label: "Price: High to Low", value: "highest" },
  { label: "Top Rated", value: "toprated" },
];

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "newest") {
      params.delete("sort"); // Remove if default
    } else {
      params.set("sort", value);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
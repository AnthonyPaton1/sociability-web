"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under £25", value: "0-25" },
  { label: "£25 to £50", value: "25-50" },
  { label: "£50 to £100", value: "50-100" },
  { label: "£100 to £200", value: "100-200" },
  { label: "Over £200", value: "200-10000" },
];

const ratings = [
  { label: "All Ratings", value: "all" },
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
  { label: "2+ Stars", value: "2" },
  { label: "1+ Stars", value: "1" },
];

// Main categories
const mainCategories = [
  { label: "All Categories", value: "all" },
  { label: "Clothing & Footwear", value: "Clothing" },
  { label: "Toys & Games", value: "Toys" },
  { label: "Arts & Crafts", value: "Arts" },
  { label: "Home & Living", value: "Home" },
  { label: "Personal Care", value: "Care" },
  { label: "Equipment & Aids", value: "Equipment" },
  { label: "Gifts & Occasions", value: "Gifts" },
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedPrice, setSelectedPrice] = useState(
    searchParams.get("price") || "all"
  );
  const [selectedRating, setSelectedRating] = useState(
    searchParams.get("rating") || "all"
  );

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedPrice !== "all") params.set("price", selectedPrice);
    if (selectedRating !== "all") params.set("rating", selectedRating);
    if (searchParams.get("sort")) params.set("sort", searchParams.get("sort")!);

    router.push(`/search?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedPrice("all");
    setSelectedRating("all");
    
    const q = searchParams.get("q");
    const sort = searchParams.get("sort");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort) params.set("sort", sort);
    
    router.push(params.toString() ? `/search?${params.toString()}` : "/search");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          {mainCategories.map((cat) => (
            <div key={cat.value} className="flex items-center space-x-2">
              <RadioGroupItem value={cat.value} id={`cat-${cat.value}`} />
              <Label htmlFor={`cat-${cat.value}`} className="cursor-pointer">
                {cat.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <RadioGroup value={selectedPrice} onValueChange={setSelectedPrice}>
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <RadioGroupItem value={range.value} id={`price-${range.value}`} />
              <Label
                htmlFor={`price-${range.value}`}
                className="cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
          {ratings.map((rating) => (
            <div key={rating.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={rating.value}
                id={`rating-${rating.value}`}
              />
              <Label
                htmlFor={`rating-${rating.value}`}
                className="cursor-pointer"
              >
                {rating.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <Button onClick={updateFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}
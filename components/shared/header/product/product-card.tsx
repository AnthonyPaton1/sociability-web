import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import StarRating from "@/components/shared/star-rating";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-full max-w-sm">
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs text-muted-foreground">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex items-center justify-between gap-4">
          <StarRating rating={Number(product.rating)} showNumber={true} size="sm" />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

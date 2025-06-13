"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    startTransition(() => {
      (async () => {
        const res = await addItemToCart(item);

        if (res.success) {
          toast.success(`${item.name} added to cart`, {
            action: {
              label: "Go to cart",
              onClick: () => router.push("/cart"),
            },
          });
        } else {
          toast.error(res.message || "Something went wrong");
        }
      })();
    });
  };

  //handle remove from cart
  const handleRemoveFromCart = () => {
    startTransition(() => {
      (async () => {
        const res = await removeItemFromCart(item.productId);

        if (res.success) {
          toast.success(`${item.name} removed from cart`);
        } else {
          toast.error(res.message || "Failed to remove item");
        }
      })();
    });
  };

  //check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div aria-busy={isPending}>
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.quantity}</span>
      <Button
        disabled={isPending}
        type="button"
        variant="outline"
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}{" "}
      Add To Cart
    </Button>
  );
};

export default AddToCart;

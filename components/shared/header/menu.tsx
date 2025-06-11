import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCartIcon } from "lucide-react";
import ModeToggle from "./mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-button";

const Menu = () => {
  const userButton = UserButton();

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCartIcon /> Cart
          </Link>
        </Button>
        {userButton}
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCartIcon /> Cart
                </Link>
              </Button>
              {userButton}
              <SheetDescription></SheetDescription>
            </SheetContent>
          </SheetTrigger>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

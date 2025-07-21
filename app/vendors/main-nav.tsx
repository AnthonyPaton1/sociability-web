"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const isVendor = session?.user?.vendorId && session?.user?.role === "vendor";

  const vendorId = session?.user?.vendorId;

  const links = [
    {
      title: "Dashboard",
      href: `/vendors/${vendorId}/dashboard`,
    },
    {
      title: "Products",
      href: `/vendors/${vendorId}/products`,
    },
    {
      title: "Orders",
      href: `/vendors/${vendorId}/orders`,
    },
    {
      title: "Users",
      href: `/vendors/${vendorId}/users`,
    },
  ];

  if (!isVendor) return null;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;

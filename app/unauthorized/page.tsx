"use client";

import Image from "next/image";
import { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 w-full max-w-md rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          You don’t have permission to view this page.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/")}
        >
          ⬅ Back to Home
        </Button>
      </div>
    </div>
  );
}

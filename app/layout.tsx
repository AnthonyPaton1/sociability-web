import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";

import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${APP_NAME}`,
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),

  keywords:
    "Disability, disabled, accessible clothing, accessible toys, accessible games, independent suppliers",

  // Recommended additions:
  // authors: [{ name: "Sociability.web Team" }],
  // creator: "Sociability.solutions",
  // publisher: "Sociability.solutions",
  // robots: "index, follow",
  // applicationName: "Sociability.web",
  // category: "E-commerce",
  // themeColor: "#ffffff", // Adjust to match your brand
  // colorScheme: "light",
  // viewport: "width=device-width, initial-scale=1",
  // icons: {
  //   icon: "/favicon.ico",
  // },
  // openGraph: {
  //   title: "Sociability.web",
  //   description:
  //     "Accessible toys and clothes from small, independent businesses.",
  //   url: "https://sociability.web",
  //   siteName: "Sociability.web",
  //   images: [
  //     {
  //       url: "/og-image.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "Sociability.web preview image",
  //     },
  //   ],
  //   locale: "en_GB",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Sociability.web",
  //   description: "Accessible toys and clothing for everyone.",
  //   images: ["/og-image.jpg"], // Optional: match OpenGraph
  //   creator: "@yourTwitterHandle", // Optional
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

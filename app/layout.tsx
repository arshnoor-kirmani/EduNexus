import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/Custom/Utils/theme-provider";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import StoreProvider from "@/components/Custom/Utils/StoreProvider";
import RouteLoader from "@/components/Custom/Utils/RouteLoading";
import { AppData as appMetadata } from "@/config/appConfig";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// 🧭 --- Site Metadata ---
export const metadata: Metadata = {
  title: appMetadata.TITLE,
  description: appMetadata.DESCRIPTION,
  icons: {
    icon: appMetadata.APP_ICON,
  },
  openGraph: {
    title: appMetadata.OG_TITLE,
    description: appMetadata.OG_DESCRIPTION,
    url: appMetadata.APP_URL,
    siteName: appMetadata.APP_NAME,
    images: [
      {
        url: `${appMetadata.APP_URL}${appMetadata.OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: appMetadata.OG_TITLE,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// 🧩 --- Root Layout ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Route Transition Loader */}
          <RouteLoader />

          {/* Page content */}
          <StoreProvider> {children}</StoreProvider>

          {/* Toast notifications */}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

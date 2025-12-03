import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/custom/utils/theme-provider";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
// import StoreProvider from "@/components/Custom/Utils/StoreProvider";
import { MetadataBuilder } from "@/lib/MetadataBuilder";
import { LoaderProvider } from "@/components/custom/utils/loader/glober-loader-provider";
import Loader from "@/components/custom/utils/loader/Loader";
import RouteLoadTrigger from "@/components/custom/utils/loader/RouteLoadTrigger";
import InternetStatus from "@/components/custom/utils/InternetStatus";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// 🧭 --- Site Metadata ---
export const metadata = MetadataBuilder.page({
  title: "Welcome",
  description:
    "EduNecus – A complete Institute Management System that simplifies student management, admissions, staff operations, attendance, courses, finances, analytics, and more.",
  keywords: [
    "Institute Management System",
    "EduNecus",
    "Student Management",
    "School Software",
    "College Management",
    "Fees Management",
    "Admin Dashboard",
    "Admission System",
    "Education ERP",
  ],
});

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
          {/* 🔥 auto-route loader */}
          <LoaderProvider>
            <RouteLoadTrigger />
            <InternetStatus />
            {children}
            <Loader />
          </LoaderProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

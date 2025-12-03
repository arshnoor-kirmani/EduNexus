import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/custom/utils/theme-toggle";
import { LogoLink } from "@/components/custom/utils/header/Header";
import { AppData } from "@/config/appConfig";
import { MetadataBuilder } from "@/lib/MetadataBuilder";

export const metadata = MetadataBuilder.auth("Institute Login");

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-small text-primary/5 pointer-events-none" />

      {/* Header Icons */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle
          variant="ghost"
          className="border bg-background/80 backdrop-blur-md hover:bg-accent transition"
        />
      </div>

      <div className="absolute top-4 left-4 z-50">
        <LogoLink name={AppData.app.name} iconUrl={AppData.app.icon} />
      </div>

      {/* Main content */}
      <main className="relative z-20 flex items-center justify-center min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 z-20 text-left px-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <b>
          <Link href="/" className="hover:underline">
            {AppData.app.name}
          </Link>
        </b>{" "}
        — All rights reserved.
      </footer>
    </div>
  );
}

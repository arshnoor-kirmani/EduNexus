import type { Metadata } from "next";
import { AppData } from "@/config/appConfig";

export class MetadataBuilder {
  /**
   * Base metadata applied to all pages
   */
  private static base(): Metadata {
    return {
      metadataBase: new URL(AppData.app.url),

      applicationName: AppData.app.name,

      icons: {
        icon: AppData.app.icon,
        shortcut: AppData.app.icon,
        apple: AppData.app.icon,
      },

      creator: AppData.app.name,
      publisher: AppData.app.name,

      keywords: [
        AppData.app.name,
        "Institute Management System",
        "EduNexus",
        "Admin Panel",
        "Student Portal",
        "Next.js",
        "Web App",
        "Institute Dashboard",
        "Online Management",
        "Frontend Admin Panel",
      ],

      category: "technology",

      openGraph: {
        type: "website",
        siteName: AppData.app.name,
        title: AppData.app.og.title,
        description: AppData.app.og.description,
        images: [
          {
            url: AppData.app.og.image,
            width: 1200,
            height: 630,
            alt: `${AppData.app.name} Preview`,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: AppData.app.og.title,
        description: AppData.app.og.description,
        images: [AppData.app.og.image],
        creator: AppData.app.name,
      },
    };
  }

  /**
   * Authentication pages
   */
  static auth(title = "Authentication"): Metadata {
    return {
      ...this.base(),

      title: {
        default: `${title}`,
        template: `%s — ${AppData.app.name}`,
      },

      description: `Secure authentication for ${AppData.app.name}. Login or create your account.`,

      robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
    };
  }

  /**
   * Dashboard / internal pages
   */
  static dashboard(title = "Dashboard", allowIndex = false): Metadata {
    return {
      ...this.base(),

      title: {
        default: `${title} — ${AppData.app.name}`,
        template: `%s — ${AppData.app.name}`,
      },

      description: `${AppData.app.name} dashboard for managing courses, students, staff, and institute operations.`,

      robots: {
        index: allowIndex,
        follow: allowIndex,
      },
    };
  }

  /**
   * Public-facing pages (SEO optimized)
   */
  static page({
    title,
    description,
    index = true,
    keywords = [],
  }: {
    title: string;
    description: string;
    index?: boolean;
    keywords?: string[];
  }): Metadata {
    return {
      ...this.base(),

      title: {
        default: `${title} — ${AppData.app.name}`,
        template: `%s — ${AppData.app.name}`,
      },

      description,

      keywords: [...this.base().keywords!, ...keywords],

      robots: {
        index,
        follow: index,
      },
    };
  }
}

import type { Metadata } from "next";
import { AppData } from "@/helper/appConfig";

export class MetadataBuilder {
  /**
   * Base metadata applied to all pages
   */
  private static base(): Metadata {
    return {
      metadataBase: new URL(AppData.APP_URL),

      applicationName: AppData.APP_NAME,

      icons: {
        icon: AppData.APP_ICON,
        shortcut: AppData.APP_ICON,
        apple: AppData.APP_ICON,
      },

      creator: AppData.APP_NAME,
      publisher: AppData.APP_NAME,

      keywords: [
        AppData.APP_NAME,
        "Institute Management System",
        "EduNecus",
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
        siteName: AppData.APP_NAME,
        images: [
          {
            url: AppData.OG_IMAGE,
            width: 1200,
            height: 630,
            alt: `${AppData.APP_NAME} Preview`,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        images: [AppData.OG_IMAGE],
        creator: AppData.APP_NAME,
      },
    };
  }

  /**
   * Authentication pages (login/register/reset)
   * - Robots blocked for security
   * - Strong metadata
   */
  static auth(title: string = "Authentication"): Metadata {
    return {
      ...this.base(),

      title: {
        // default: `${title} — ${AppData.APP_NAME}`,
        default: `${title} `,
        template: `%s — ${AppData.APP_NAME}`,
      },

      description: `Secure authentication gateway for ${AppData.APP_NAME}. Login or create your account.`,

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
   * Dashboard / App Internal Areas
   * - Allows indexing of main pages (optional)
   */
  static dashboard(title: string = "Dashboard", allowIndex = false): Metadata {
    return {
      ...this.base(),

      title: {
        default: `${title} — ${AppData.APP_NAME}`,
        template: `%s — ${AppData.APP_NAME}`,
      },

      description: `${AppData.APP_NAME} dashboard for managing courses, students, staff, and institute operations.`,

      robots: {
        index: allowIndex,
        follow: allowIndex,
      },
    };
  }

  /**
   * Public facing pages — full SEO enabled
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
        default: `${title} — ${AppData.APP_NAME}`,
        template: `%s — ${AppData.APP_NAME}`,
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

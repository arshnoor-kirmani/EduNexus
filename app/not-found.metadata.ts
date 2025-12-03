import type { Metadata } from "next";
import { AppData } from "@/config/appConfig";

export const metadata: Metadata = {
  title: AppData.meta.notFound.title,
  description: AppData.meta.notFound.description,

  robots: { index: false },

  openGraph: {
    title: AppData.meta.notFound.title,
    description: AppData.meta.notFound.description,
    images: [
      {
        url: `${AppData.app.url}${AppData.meta.notFound.image}`,
        width: 1200,
        height: 630,
        alt: AppData.meta.notFound.title,
      },
    ],
    url: AppData.app.url,
    siteName: AppData.app.name,
    type: "website",
  },
};

import type { Metadata } from "next";
import { AppData } from "@/helper/appConfig";

export const metadata: Metadata = {
  title: AppData.NOT_FOUND_TITLE,
  description: AppData.NOT_FOUND_DESCRIPTION,

  robots: { index: false },

  openGraph: {
    title: AppData.NOT_FOUND_TITLE,
    description: AppData.NOT_FOUND_DESCRIPTION,
    images: [
      {
        url: `${AppData.APP_URL}${AppData.NOT_FOUND_OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: AppData.NOT_FOUND_TITLE,
      },
    ],
    url: AppData.APP_URL,
    siteName: AppData.APP_NAME,
    type: "website",
  },
};

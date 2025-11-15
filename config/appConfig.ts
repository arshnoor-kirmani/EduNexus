export const AppData = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "EduNexus",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com",
  APP_ICON: process.env.NEXT_PUBLIC_ICON_URL || "/favicon.ico",

  TITLE:
    process.env.NEXT_PUBLIC_META_TITLE ||
    "EduNexus — Manage Your Institute Smarter",
  DESCRIPTION:
    process.env.NEXT_PUBLIC_META_DESCRIPTION ||
    "EduNexus is an intelligent Institute Management System that simplifies administration and enhances learning experiences.",

  OG_TITLE:
    process.env.NEXT_PUBLIC_META_OG_TITLE ||
    "EduNexus | Institute Management Made Smarter",

  OG_DESCRIPTION:
    process.env.NEXT_PUBLIC_META_OG_DESCRIPTION ||
    "Streamline institute operations with EduNexus — secure, scalable, and role-based management.",

  OG_IMAGE: process.env.NEXT_PUBLIC_META_OG_IMAGE || "/og-image.png",

  HeadersDetails: {
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
    actions: [{ title: "Get Started", href: "/auth/institute-register" }],
    name: "EduNexus",
    icon: process.env.NEXT_PUBLIC_ICON_URL || "/favicon.ico",
    description: "A web application for Institute Management.",
  },
};

export const AppData = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "EduNexus",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com",
    icon: process.env.NEXT_PUBLIC_ICON_URL || "/favicon.ico",

    og: {
      title:
        process.env.NEXT_PUBLIC_META_OG_TITLE ||
        "EduNexus | Institute Management Made Smarter",

      description:
        process.env.NEXT_PUBLIC_META_OG_DESCRIPTION ||
        "Streamline institute operations with EduNexus — secure, scalable, and role-based management.",

      image: process.env.NEXT_PUBLIC_META_OG_IMAGE || "/og-image.png",
    },
  },

  meta: {
    default: {
      title:
        process.env.NEXT_PUBLIC_META_TITLE ||
        "EduNexus — Manage Your Institute Smarter",

      description:
        process.env.NEXT_PUBLIC_META_DESCRIPTION ||
        "EduNexus is an intelligent Institute Management System that simplifies administration and enhances learning experiences.",

      image: process.env.NEXT_PUBLIC_META_OG_IMAGE || "/og-image.png",

      og: {
        title:
          process.env.NEXT_PUBLIC_META_OG_TITLE ||
          "EduNexus | Institute Management Made Smarter",

        description:
          process.env.NEXT_PUBLIC_META_OG_DESCRIPTION ||
          "Streamline institute operations with EduNexus — secure, scalable, and role-based management.",

        image: process.env.NEXT_PUBLIC_META_OG_IMAGE || "/og-image.png",
      },
    },

    notFound: {
      title:
        process.env.NEXT_PUBLIC_NOT_FOUND_TITLE || "Page Under Construction",

      description:
        process.env.NEXT_PUBLIC_NOT_FOUND_DESCRIPTION ||
        "This page is currently being built. Please check back soon.",

      image:
        process.env.NEXT_PUBLIC_NOT_FOUND_OG_IMAGE ||
        "/under-construction-og.png",
    },
  },

  header: {
    landing: {
      links: [
        { title: "Home", href: "/" },
        { title: "About", href: "/about" },
        { title: "Contact", href: "/contact" },
      ],
      actions: [{ title: "Get Started", href: "/auth/institute-register" }],
    },
  },

  routes: {
    frontend: {
      auth: {
        login: {
          institute: "/auth/institute-login",
          user: "/auth/user-login",
          teacher: "/auth/teacher-login",
          student: "/auth/student-login",
        },
        register: {
          institute: "/auth/institute-register",
          user: "/auth/user-register",
          teacher: "/auth/teacher-register",
          student: "/auth/student-register",
        },
        otp: {
          send: "/auth/send-otp",
          verify: "/auth/verify-otp",
        },
        resetPassword: {
          institute: "/auth/reset-password",
          confirm: "/auth/confirm-password",
        },
      },

      dashboard: {
        institute: "/institute/dashboard",
        user: "/user/dashboard",
        teacher: "/teacher/dashboard",
        student: "/student/dashboard",
      },

      profile: {
        institute: "/institute/profile",
        user: "/user/profile",
        teacher: "/teacher/profile",
        student: "/student/profile",
      },

      settings: {
        institute: "/institute/settings",
        user: "/user/settings",
        teacher: "/teacher/settings",
        student: "/student/settings",
      },
    },
  },
} as const;

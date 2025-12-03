import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // ===========================
  // USER SHAPE (Server side)
  // ===========================
  interface User extends DefaultUser {
    _id: string;
    role: "institute" | "student" | "teacher" | "user";
    name: string;
    identifier: string;
    institute_id: string | null;
  }

  // ===========================
  // SESSION (Client side)
  // ===========================
  interface Session {
    user: {
      _id: string;
      role: "institute" | "student" | "teacher" | "user";
      name: string;
      identifier: string;
      institute_id: string | null;
    };
    expires: string;
  }
}

declare module "next-auth/jwt" {
  // ===========================
  // JWT SHAPE
  // ===========================
  interface JWT {
    _id: string;
    role: "institute" | "student" | "teacher" | "user";
    name: string;
    identifier: string;
    institute_id: string | null;
  }
}

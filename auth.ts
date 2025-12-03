// auth.ts
import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOption";

export const { handlers, signIn, signOut } = NextAuth(authOptions);

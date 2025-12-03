import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/DatabaseConnection";
import InstituteModel from "@/models/InstituteSchema";
import { StudentModel } from "@/models/StudentsSchema";
import { TeacherModel } from "@/models/TeacherSchema";
import { User as UserType } from "next-auth";
import { saveLoginActivity } from "@/lib/saveLoginActivity";

// Utility: limit returned user fields
const publicUser = (user: any, role: string) => ({
  _id: String(user._id),
  role,
  name: user.name || user.username || "User",
  email: user.email || null,
  institute_id: user.institute_id ? String(user.institute_id) : null,
  identifier: user.email || user.student_id || user.teacher_id,
});

export const authOptions: NextAuthOptions = {
  providers: [
    // ======================================================
    // 1) INSTITUTE LOGIN
    // ======================================================
    CredentialsProvider({
      id: "institute-login",
      name: "Institute",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req): Promise<UserType | null> {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Email & password required.");
        console.log("Credentials Institute", credentials);
        await dbConnect();

        const institute = await InstituteModel.findOne(
          { email: credentials.email },
          { email: 1, password: 1, isVerified: 1, name: 1 }
        );

        if (!institute) throw new Error("Institute not found.");
        if (!institute.isVerified)
          throw new Error("Institute account is not verified.");

        const isValid = await bcrypt.compare(
          credentials.password,
          institute.password
        );
        console.log("Institute found:", institute, isValid);
        if (!isValid) throw new Error("Invalid password.");

        // update lastLogin
        institute.lastLogin = new Date();
        await institute.save();

        // save login activity
        await saveLoginActivity({
          user: institute,
          role: "institute",
          institute_id: String(institute._id),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        return publicUser(institute, "institute") as unknown as UserType;
      },
    }),

    // ======================================================
    // 2) STUDENT LOGIN
    // ======================================================
    CredentialsProvider({
      id: "student-login",
      name: "Student",
      credentials: {
        institute_id: {},
        student_id: {},
        password: {},
      },
      async authorize(credentials, req): Promise<UserType | null> {
        if (
          !credentials?.institute_id ||
          !credentials?.student_id ||
          !credentials?.password
        )
          throw new Error("All fields required.");

        await dbConnect(credentials.institute_id);

        const student = await StudentModel.findOne(
          { student_id: credentials.student_id },
          {
            student_id: 1,
            password: 1,
            verify: 1,
            name: 1,
            institute_id: 1,
          }
        );

        if (!student) throw new Error("Student not found.");
        if (!student.verify?.isActive)
          throw new Error("Your account is deactivated. Contact institute.");

        const isValid = await bcrypt.compare(
          credentials.password,
          student.password
        );
        if (!isValid) throw new Error("Invalid password.");

        // update lastLogin
        student.lastLogin = new Date();
        await student.save();

        await saveLoginActivity({
          user: student,
          role: "student",
          institute_id: student.institute_id.toString(),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        return publicUser(student, "student") as unknown as UserType;
      },
    }),

    // ======================================================
    // 3) TEACHER LOGIN
    // ======================================================
    CredentialsProvider({
      id: "teacher-login",
      name: "Teacher",
      credentials: {
        institute_id: {},
        teacher_id: {},
        password: {},
      },
      async authorize(credentials, req): Promise<UserType | null> {
        if (
          !credentials?.institute_id ||
          !credentials?.teacher_id ||
          !credentials?.password
        )
          throw new Error("All fields required.");

        await dbConnect(credentials.institute_id);

        const teacher = await TeacherModel.findOne(
          { teacher_id: credentials.teacher_id },
          {
            teacher_id: 1,
            password: 1,
            verify: 1,
            name: 1,
            institute_id: 1,
          }
        );

        if (!teacher) throw new Error("Teacher not found.");
        if (!teacher.verify?.isActive)
          throw new Error("Your account is deactivated. Contact institute.");

        const isValid = await bcrypt.compare(
          credentials.password,
          teacher.password
        );
        if (!isValid) throw new Error("Invalid password.");

        // update lastLogin
        teacher.lastLogin = new Date();
        await teacher.save();

        await saveLoginActivity({
          user: teacher,
          role: "teacher",
          institute_id: teacher.institute_id.toString(),
          ip: req?.headers?.["x-forwarded-for"]?.toString() || "",
          userAgent: req?.headers?.["user-agent"]?.toString() || "",
        });

        return publicUser(teacher, "teacher") as unknown as UserType;
      },
    }),
  ],

  // ======================================================
  // PAGES
  // ======================================================
  pages: {
    signIn: "/",
    error: "/",
  },

  // ======================================================
  // CALLBACKS
  // ======================================================
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return baseUrl + url;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.role = user.role;
        token.name = user.name;
        token.identifier = user.identifier;
        token.institute_id = user.institute_id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        _id: token._id,
        role: token.role,
        name: token.name,
        identifier: token.identifier,
        institute_id: token.institute_id,
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

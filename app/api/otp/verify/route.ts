import dbConnect from "@/lib/DatabaseConnection";
import { verifyOtpSchema } from "@/lib/validators/Api/Verify";
import { NextResponse } from "next/server";

// Import all role models
import InstituteModel from "@/models/InstituteSchema";
import { apiClient } from "@/helper/ApiClient";
// import StudentModel from "@/models/StudentSchema";
// import TeacherModel from "@/models/TeacherSchema";
// import UserModel from "@/models/UserSchema";
// import AdminModel from "@/models/AdminSchema";

const ROLE_MODELS: Record<string, any> = {
  institute: InstituteModel,
  //   student: StudentModel,
  //   teacher: TeacherModel,
  //   user: UserModel,
  //   admin: AdminModel,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = await verifyOtpSchema.parseAsync(body);

    const { identifier, code } = parsed;
    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, message: "identifier and code are required" },
        { status: 400 }
      );
    }
    await dbConnect("institutes");
    const institute = await InstituteModel.findOne({
      $or: [
        { email: identifier },
        { institute_code: identifier },
        { _id: identifier },
      ],
    });
    if (!institute) {
      return NextResponse.json(
        { success: false, message: "Institute not found" },
        { status: 404 }
      );
    }
    if (institute.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Institute already verified",
        data: { isVerified: true },
      });
    }
    // OTP must exist
    if (!institute.verifyCode || !institute.verifyCodeExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "No active OTP found",
          data: { isVerified: false },
        },
        { status: 400 }
      );
    }

    // Expiry check
    if (Date.now() > new Date(institute.verifyCodeExpiry).getTime()) {
      return NextResponse.json(
        { success: false, message: "OTP expired", data: { isVerified: false } },
        { status: 400 }
      );
    }

    // -----------------------------
    // 5. Compare hashed OTP safely
    // -----------------------------
    const valid = await apiClient.verifyOtpHash(code, institute.verifyCode);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code",
          data: { isVerified: false },
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // 6. Apply verification logic per flow type
    // -----------------------------
    institute.isVerified = true;
    // Clear OTP fields
    institute.verifyCode = null;
    institute.verifyCodeExpiry = null;

    await institute.save();

    return NextResponse.json({
      success: true,
      message: "Verified",
      data: { isVerified: true },
    });
  } catch (e: any) {
    console.error("OTP verification error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        data: { isVerified: false },
      },
      { status: 500 }
    );
  }
}

import dbConnect from "@/lib/DatabaseConnection";
import { verifyOtpSchema } from "@/lib/validators/Api/Verify";
import { NextResponse } from "next/server";
import InstituteModel from "@/models/InstituteSchema";
import { apiClient } from "@/helper/ApiClient";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    // 1) Parse body
    const body = await req.json();
    const { identifier, code } = await verifyOtpSchema.parseAsync(body);
    console.log(" InstituteConf codeVerify", { identifier, code });
    if (!identifier || !code) {
      return NextResponse.json(
        { success: false, message: "identifier and code are required" },
        { status: 400 }
      );
    }

    // 2) DB Connect
    await dbConnect();

    // 3) Build safe query
    const query: any[] = [
      { email: identifier },
      { "information.email": identifier },
      { "information.institute_code": identifier },
    ];

    // If identifier looks like a valid ObjectId, include it
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query.push({ _id: identifier });
    }
    console.log("query", query);
    // 4) Find institute
    const institute = await InstituteModel.findOne({ $or: query });
    console.log("institute", institute);
    if (!institute) {
      return NextResponse.json(
        { success: false, message: "Institute not found, please register" },
        { status: 404 }
      );
    }

    // 5) Already verified
    if (institute.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Institute already verified, no need to verify again",
        data: { isVerified: true },
      });
    }

    // 6) OTP must exist
    if (!institute.verifyCode || !institute.verifyCodeExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "No active OTP found, please request again",
          data: { isVerified: false },
        },
        { status: 400 }
      );
    }

    // 7) Check expiry
    const expiry = new Date(institute.verifyCodeExpiry).getTime();
    const now = Date.now();

    console.log("NOW:", now);
    console.log("EXPIRY:", expiry);
    console.log("DIFF:", expiry - now);

    if (Date.now() > new Date(institute.verifyCodeExpiry).getTime()) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired, please request again",
          data: { isVerified: false },
        },
        { status: 400 }
      );
    }

    // 8) Compare hashed OTP
    const valid = await apiClient.verifyOtpHash(code, institute.verifyCode);
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP is not correct, please try again",
          data: { isVerified: false },
        },
        { status: 400 }
      );
    }

    // 9) Mark verified
    institute.isVerified = true;

    // Optional: Clear OTP fields
    institute.verifyCode = null;
    institute.verifyCodeExpiry = null;

    await institute.save();

    return NextResponse.json({
      success: true,
      message: "Institute verified successfully",
      data: { isVerified: false },
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

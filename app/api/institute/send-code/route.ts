import { EmailSender } from "@/config/EmailSendConfig";
import dbConnect from "@/lib/DatabaseConnection";
import InstituteModel from "@/models/InstituteSchema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Identifier is required" },
        { status: 400 }
      );
    }
    dbConnect();
    const query: any[] = [
      { email: identifier },
      { "information.email": identifier },
      { "information.institute_code": identifier },
    ];

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query.push({ _id: identifier });
    }
    const institute = await InstituteModel.findOne({ $or: query });
    if (!institute) {
      return NextResponse.json(
        { success: false, message: "Institute not found, please register" },
        { status: 405 }
      );
    }
    const code = EmailSender.generateOtp();
    const hashCode = await EmailSender.generateHash(code);
    const codeExpiry = EmailSender.generateExpiry();

    try {
      institute.verifyCode = hashCode;
      institute.verifyCodeExpiry = codeExpiry;
      institute.verifyCode = hashCode;
      institute.verifyCodeExpiry = codeExpiry;
      await institute.save();
      await EmailSender.sendEmail({
        code,
        expiry: codeExpiry,
        to: institute.email,
        purpose: "verify",
        username: institute.username,
        instituteName: institute.information.institute_name,
      });

      return NextResponse.json({
        success: true,
        message: "Code saved successfully",
        data: {
          expiry: codeExpiry,
        },
      });
    } catch (error) {
      console.error("Error saving code:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save verification code" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

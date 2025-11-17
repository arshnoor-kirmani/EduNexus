import dbConnect from "@/lib/DatabaseConnection";
import {
  generateEmailTemplate,
  generateOtp,
  hashOtp,
  otpExpiry,
} from "@/config/ApiConfig";
import InstituteModel from "@/app/models/InstituteSchema";
import { PostCreateInstituteRequest } from "@/types/api/institute/institute-api";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EmailSender } from "@/config/EmailSendConfig";

const UpdateInstituteSchema = z.object({
  institute_code: z.string().min(1, "Institute code is required"),
  info: z.record(z.string(), z.any()).optional(),
});

// ============================= POST =========================================
export async function POST(request: NextRequest) {
  try {
    const body: PostCreateInstituteRequest = await request.json();
    if (!body) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const { name: username, Email: email, password, institute_name } = body;

    await dbConnect("institutes");

    const existingInstitute = await InstituteModel.findOne({ email });
    const code = EmailSender.generateOtp();
    const verifyCode = await hashOtp(code);
    const verifyCodeExpiry = EmailSender.generateExpiry();

    // ================= Existing User Case =================
    if (existingInstitute && existingInstitute.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    if (existingInstitute && !existingInstitute.isVerified) {
      existingInstitute.verifyCode = verifyCode;
      existingInstitute.verifyCodeExpiry = verifyCodeExpiry;
      try {
        await existingInstitute.save();
        EmailSender.sendEmail({
          code,
          expiry: verifyCodeExpiry,
          to: email,
          purpose: "verify",
          username,
          instituteName: institute_name,
        });
        return NextResponse.json(
          {
            success: true,
            message: "Verification code resent successfully.",
            userId: String(existingInstitute._id),
          },
          { status: 200 }
        );
      } catch (error) {
        console.error("Error saving institute:", error);
        return NextResponse.json(
          { success: false, message: "Something went wrong to create account" },
          { status: 500 }
        );
      }
    }

    // ================= New Institute Case =================
    const hashedPassword = await bcrypt.hash(password, 10);
    const initials = institute_name
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");

    const totalInstitutes = await InstituteModel.countDocuments();
    const institute_code = `${initials}${String(totalInstitutes + 1).padStart(
      4,
      "0"
    )}`;

    const newInstitute = await InstituteModel.create({
      username,
      email,
      password: hashedPassword,
      institute_name,
      institute_code,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
    });

    const html = generateEmailTemplate(
      code,
      "verify",
      username,
      institute_name
    );

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Verify Your Institute Email - EduNexus",
        html,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Institute created successfully. Verification code sent.",
        userId: String(newInstitute._id),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /institute error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ============================= GET ==========================================
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get("identifier");

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Identifier is required" },
        { status: 400 }
      );
    }

    await dbConnect("institutes");

    const institute = await InstituteModel.findOne({
      $or: [{ email: identifier }, { institute_code: identifier }],
    }).lean();

    if (!institute) {
      return NextResponse.json(
        { success: false, message: "Institute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Institute found", user: institute },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /institute error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================= PUT ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = UpdateInstituteSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json(
        { success: false, message: errors },
        { status: 400 }
      );
    }

    const { institute_code, info = {} } = parsed.data;
    await dbConnect("institutes");

    const updated = await InstituteModel.findOneAndUpdate(
      { institute_code },
      { $set: { information: info } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Institute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Institute updated successfully",
        user: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /institute error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

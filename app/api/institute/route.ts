import dbConnect from "@/lib/DatabaseConnection";
import { hashOtp } from "@/config/ApiConfig";
import InstituteModel from "@/models/InstituteSchema";
import { PostCreateInstituteRequest } from "@/types/api/institute/institute-api";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EmailSender } from "@/config/EmailSendConfig";
import { InstituteConf } from "@/config/InstituteClient";

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

    const { name: username, email, password, institute_name } = body;

    await dbConnect();

    const existingInstitute = await InstituteModel.findOne({ email });

    const code = EmailSender.generateOtp();
    const verifyCode = await EmailSender.generateHash(code);
    const verifyCodeExpiry = EmailSender.generateExpiry();
    const hashedPassword = await EmailSender.generateHash(password);
    const codeResult = await InstituteConf.generateInstituteCode(
      institute_name
    );
    console.log({ codeResult }); //remove
    if (!codeResult.success) {
      console.warn("FALLBACK CODE:", codeResult.message);
    }
    const finalInstituteCode: string = codeResult.institute_code;

    // ==========================================
    // 1️⃣ If email already verified → BLOCK
    // ==========================================
    if (existingInstitute && existingInstitute.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // ==========================================
    // 2️⃣ If email exists but NOT verified → RESEND OTP
    // ==========================================
    if (existingInstitute && !existingInstitute.isVerified) {
      existingInstitute.username = username;
      existingInstitute.password = hashedPassword;
      existingInstitute.verifyCode = verifyCode;
      existingInstitute.verifyCodeExpiry = verifyCodeExpiry;

      Object.assign(existingInstitute.information, {
        institute_code: finalInstituteCode,
        institute_name: institute_name,
      });

      existingInstitute.isVerified = false;

      await existingInstitute.save().then(() => {
        console.log("Institute Information are updated.....");
      });

      const emailRes = await EmailSender.sendEmail({
        code,
        expiry: verifyCodeExpiry,
        to: email,
        purpose: "verify",
        username,
        instituteName: institute_name,
      });

      if (!emailRes.success) {
        return NextResponse.json(
          { success: false, message: emailRes.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Verification code re-sent. Please verify your account.",
          data: {
            institute_id: String(existingInstitute._id),
            institute_name: existingInstitute.information.institute_name,
          },
        },
        { status: 200 }
      );
    }

    // ==========================================
    // 3️⃣ CREATE NEW INSTITUTE
    // ==========================================
    const newInstitute = await InstituteModel.create({
      username,
      email,
      password: hashedPassword,
      information: {
        institute_name,
        email,
        institute_code: finalInstituteCode,
      },
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
    });

    // send OTP
    const emailRes = await EmailSender.sendEmail({
      code,
      expiry: verifyCodeExpiry,
      to: email,
      purpose: "verify",
      username,
      instituteName: institute_name,
    });

    if (!emailRes.success) {
      return NextResponse.json(
        { success: false, error: emailRes.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Institute created successfully. Verification code sent.",
        data: {
          institute_id: String(newInstitute._id),
          institute_name: newInstitute.information.institute_name,
        },
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

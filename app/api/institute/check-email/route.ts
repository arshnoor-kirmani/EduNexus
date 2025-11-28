import InstituteModel from "@/models/InstituteSchema";
import dbConnect from "@/lib/DatabaseConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    // ---------------- VALIDATION ----------------
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
          data: { isRegistered: false },
        },
        { status: 400 }
      );
    }

    // ---------------- DATABASE CONNECT ----------------
    await dbConnect();

    // ---------------- QUERY ----------------
    const institute = await InstituteModel.findOne({ email })
      .select("_id email institute_name isVerified information.institute_name")
      .lean();
    console.log(institute);
    // ---------------- RESPONSE: FOUND ----------------
    if (institute) {
      return NextResponse.json(
        {
          success: true,
          message: "Email already registered.",
          data: { isRegistered: true, institute },
        },
        { status: 200 }
      );
    }

    // ---------------- RESPONSE: NOT FOUND ----------------
    return NextResponse.json(
      {
        success: true,
        message: "Email not registered.",
        data: { isRegistered: false },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /institute/check → Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

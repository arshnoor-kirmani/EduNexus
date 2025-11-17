import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    // SMTP Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_EMAIL_PORT) || 587,
      secure: process.env.SMTP_EMAIL_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.SMTP_EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email sent",
        data: {
          messageId: info.messageId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Email sending failed",
        data: error?.message || error,
      },
      { status: 500 }
    );
  }
}

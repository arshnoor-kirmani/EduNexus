import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export const bcryptRounds = Number(process.env.OTP_HASH_SALT_ROUNDS ?? 10);

export async function generateOtp(): Promise<string> {
  // 6-digit numeric
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, bcryptRounds);
}

export async function verifyOtpHash(
  code: string,
  hash: string
): Promise<boolean> {
  console.log({ code, hash });
  return bcrypt.compare(code, hash);
}

// 10 minutes default expiry
export async function otpExpiry(): Promise<Date> {
  const expiryInSeconds = Number(process.env.CODE_EXPIRY_TIME ?? 600); // default 10 min
  const d = new Date();
  d.setTime(d.getTime() + expiryInSeconds * 1000);
  return d;
}

export async function generateEmailTemplate(
  verifyCode: number | string | null,
  purpose: "reset" | "verify" | "custom" = "reset",
  username = "User",
  institute_name = process.env.APP_NAME ?? "Institute Management System",
  customMessage?: string
): Promise<string> {
  const minutes = Number(process.env.CODE_EXPIRY_TIME) / 60;
  let title = "";
  let intro = "";
  let codeBlock = "";

  switch (purpose) {
    case "verify":
      title = `Verify your ${institute_name} account`;
      intro = `Thank you for signing up with <b>${institute_name}</b>. Please verify your email using the One-Time Password (OTP) below:`;
      break;

    case "reset":
      title = `Reset your ${institute_name} password`;
      intro = `You requested to reset your password for <b>${institute_name}</b>. Please use the OTP below to continue:`;
      break;

    case "custom":
      title = `Message from ${institute_name}`;
      intro = customMessage
        ? customMessage
        : "Here’s an important update from your institute:";
      break;

    default:
      title = `${institute_name} Notification`;
      intro = "Here is your requested verification code:";
      break;
  }

  // Include OTP only if available (skip for purely custom messages)
  if (verifyCode) {
    codeBlock = `
      <div style="text-align: center; margin: 28px 0;">
        <span style="
          display: inline-block;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 10px;
          background-color: #EFF6FF;
          color: #2563EB;
          padding: 16px 32px;
          border-radius: 10px;
          border: 1px solid #BFDBFE;
        ">
          ${verifyCode}
        </span>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 32px; background-color: #F1F5F9; font-family: 'Inter', Arial, sans-serif;">
    <div style="
      max-width: 520px;
      margin: auto;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      padding: 36px 32px;
      border: 1px solid #E2E8F0;
    ">
      <h1 style="font-size: 22px; font-weight: 600; color: #0F172A; text-align: center; margin-bottom: 24px;">
        ${title}
      </h1>

      <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 16px;">
        Hi <b>${username}</b>,
      </p>

      <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
        ${intro}
      </p>

      ${codeBlock}

      ${
        verifyCode
          ? `<p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
              This code is valid for <b>${minutes} minutes</b>. Please do not share it with anyone for your security.
            </p>`
          : ""
      }

      <p style="font-size: 14px; color: #94A3B8; line-height: 1.6; text-align: center; margin-top: 32px;">
        If you didn’t request this ${
          purpose === "verify" ? "verification" : "message"
        }, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 28px 0;" />

      <p style="font-size: 13px; color: #94A3B8; text-align: center;">
        — The ${process.env.NEXT_PUBLIC_APP_NAME} Team
      </p>
    </div>
  </body>
</html>`;
}

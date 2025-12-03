import { apiClient } from "@/helper/ApiClient";
import { EmailSenderConfigResponse } from "@/types/api/helper/utils";
import bcrypt from "bcryptjs";

class EmailSenderConfig {
  private expiryInSeconds: number;
  private apiUrl: string;
  private bcryptRounds: number;

  constructor() {
    this.expiryInSeconds = Number(process.env.CODE_EXPIRY_TIME ?? 600);
    this.bcryptRounds = Number(process.env.OTP_HASH_SALT_ROUNDS ?? 10);

    const endpoint = process.env.EMAIL_SENDER_ENDPOINT || "/api/send-email";

    // Build absolute URL on server, allow relative on client
    if (typeof window === "undefined") {
      const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      this.apiUrl = new URL(endpoint, base).href;
    } else {
      this.apiUrl = endpoint;
    }
  }

  /** Generate 6-digit OTP */
  public generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  /** Hashed OTP */
  public generateHash(value: string): Promise<string> {
    return bcrypt.hash(value, this.bcryptRounds);
  }

  /** Verify OTP */
  public verfiyOtpHash(code: string, hash: string): Promise<boolean> {
    return bcrypt.compare(code, hash);
  }

  /** Expiry timestamp */
  public generateExpiry(): Date {
    return new Date(Date.now() + this.expiryInSeconds * 1000);
  }

  /** Email HTML Builder */
  public async generateTemplate({
    code,
    purpose,
    username,
    instituteName,
    customMessage,
  }: {
    code: string | null;
    purpose: "verify" | "reset" | "custom";
    username: string;
    instituteName: string;
    customMessage?: string;
  }): Promise<string> {
    try {
      const minutes = this.expiryInSeconds / 60;

      const purposeMap: Record<
        "verify" | "reset" | "custom",
        { title: string; intro: string }
      > = {
        verify: {
          title: `Verify your ${instituteName} account`,
          intro: `Welcome to <b>${instituteName}</b>! Use the OTP below to verify your account.`,
        },
        reset: {
          title: `Reset your ${instituteName} password`,
          intro: `Use the OTP below to reset your password for <b>${instituteName}</b>.`,
        },
        custom: {
          title: `Message from ${instituteName}`,
          intro: customMessage ?? "Here’s an important update:",
        },
      };

      const { title, intro } = purposeMap[purpose];

      const containerStyle = `
        max-width:600px;
        margin:48px auto;
        background:white;
        padding:40px 36px;
        border-radius:14px;
        border:1px solid #E5E7EB;
        box-shadow:0 8px 20px rgba(0,0,0,0.05);
      `;

      const codeStyle = `
        display:inline-block;
        font-size:36px;
        font-weight:700;
        letter-spacing:12px;
        padding:18px 36px;
        border-radius:12px;
        background:#EEF2FF;
        color:#4338CA;
        border:1px solid #C7D2FE;
      `;

      const codeBlock = code
        ? `
        <div style="text-align:center;margin:32px 0;">
          <div style="${codeStyle}">
            ${code}
          </div>
        </div>`
        : "";

      return `
      <html>
        <body style="margin:0;padding:0;background:#F3F4F6;font-family:Inter,Arial;">
          <div style="${containerStyle}">
            
            <h1 style="font-size:24px;font-weight:600;text-align:center;color:#111827;margin-bottom:24px;">
              ${title}
            </h1>

            <p style="font-size:16px;color:#374151;line-height:1.7;margin-bottom:16px;">
              Hi <b>${username}</b>,
            </p>

            <p style="font-size:16px;color:#374151;line-height:1.7;margin-bottom:28px;">
              ${intro}
            </p>

            ${codeBlock}

            ${
              code
                ? `<p style="font-size:15px;color:#4B5563;line-height:1.7;margin-bottom:32px;">
                    This code is valid for <b>${minutes} minutes</b>.
                  </p>`
                : ""
            }

            <hr style="border:none;border-top:1px solid #E5E7EB;margin:32px 0;" />

            <p style="font-size:13px;color:#9CA3AF;text-align:center;">
              — The ${process.env.NEXT_PUBLIC_APP_NAME} Team
            </p>

          </div>
        </body>
      </html>`;
    } catch (err) {
      console.error("Email template generation error:", err);
      throw new Error("Error while building email template.");
    }
  }

  /** Main Send Email Method */
  public async sendEmail({
    code,
    expiry,
    to,
    purpose,
    username,
    instituteName,
    customMessage,
    subject,
  }: {
    code: string | null;
    expiry: Date | null;
    to: string;
    purpose: "verify" | "reset" | "custom";
    username: string;
    instituteName: string;
    customMessage?: string;
    subject?: string;
  }): Promise<EmailSenderConfigResponse<any>> {
    try {
      const html = await this.generateTemplate({
        code,
        purpose,
        username,
        instituteName,
        customMessage,
      });

      const fallbackSubjectMap = {
        verify: "Verify Your Email - EduNexus",
        reset: "Reset Your Password - EduNexus",
        custom: "New Message From EduNexus",
      } as const;

      const finalSubject = subject ?? fallbackSubjectMap[purpose];

      const response = await apiClient.post(this.apiUrl, {
        to,
        subject: finalSubject,
        html,
      });

      return {
        success: true,
        message: "Email sent successfully",
        data: { apiResponse: response, code, expiry },
      };
    } catch (error: any) {
      console.error("Email sending error:", error);

      return {
        success: false,
        message: "Unable to send email.",
        data: error?.response?.data ?? error,
      };
    }
  }
}

export const EmailSender = new EmailSenderConfig();

import InstituteModel from "@/models/InstituteSchema";
import { apiClient } from "../helper/ApiClient";
import {
  errorToast,
  promiseToast,
  successToast,
  warningToast,
} from "@/components/custom/utils/Toast";
import {
  InstituteCheckEmailResponse,
  InstituteCodeResponse,
} from "@/types/api/institute/institute-api";
import { signIn } from "next-auth/react";
// import { ApiResponse }
class Institute {
  private IGNORE_WORDS: string[];

  constructor() {
    this.IGNORE_WORDS = ["of", "the", "and", "&"];
  }

  /**
   * --------------------------------
   * Generate Short Initials
   * --------------------------------
   */
  public generateInitials(name: string): string {
    const filtered = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
      .filter((w) => !this.IGNORE_WORDS.includes(w));

    const initials = filtered.map((w) => w[0].toUpperCase()).join("");

    return initials || "INS";
  }

  /**
   * --------------------------------
   * Generate Institute Code
   * --------------------------------
   */
  public async generateInstituteCode(
    institute_name: string
  ): Promise<InstituteCodeResponse> {
    try {
      if (!institute_name || typeof institute_name !== "string") {
        throw new Error("Invalid institute name");
      }

      const initials = this.generateInitials(institute_name);
      const regex = new RegExp(`^${initials}`, "i");

      const lastCode = await InstituteModel.findOne({
        "information.institute_code": regex,
      })
        .select("information.institute_code")
        .sort({ "information.institute_code": -1 })
        .lean();

      let nextNumber = 1;

      if (lastCode?.information?.institute_code) {
        const numeric = lastCode.information.institute_code.replace(
          initials,
          ""
        );
        const parsed = Number(numeric);
        if (!Number.isNaN(parsed)) nextNumber = parsed + 1;
      }

      const institute_code = `${initials}${String(nextNumber).padStart(
        4,
        "0"
      )}`;

      return { success: true, institute_code };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";

      const fallback =
        "INS" + String(Math.floor(Math.random() * 9999)).padStart(4, "0");

      return {
        success: false,
        message: msg,
        institute_code: fallback,
      };
    }
  }

  /**
   * --------------------------------
   * Email uniqueness check
   * --------------------------------
   */
  public async checkEmailUnique(
    email: string
  ): Promise<ApiResponse<InstituteCheckEmailResponse>> {
    try {
      const res = await apiClient.get<ApiResponse<InstituteCheckEmailResponse>>(
        "institute/check-email",
        { email }
      );

      return res;
    } catch (err: any) {
      errorToast("Error checking email");
      return {
        success: false,
        error: "Error checking email",
        data: { isRegistered: false },
      };
    }
  }

  /**
   * --------------------------------
   * Register Institute
   * --------------------------------
   */
  public async register(values: any): Promise<boolean> {
    try {
      const result = await apiClient.post<
        ApiResponse<{ institute_id: string; institute_name: string }>
      >("institute", values);

      if (!result.success) {
        errorToast(result.error || "Registration failed");
        return false;
      }
      successToast("Registration Successful!", {
        description:
          // <span className="text-emerald-700 animate-pulse">
          `${result.data.institute_name}" has been created successfully. A
            verification code has been sent to your email.`,
        // </span>
      });

      return true;
    } catch (err: any) {
      const apiError =
        err?.message || "Something went wrong during registration.";
      errorToast(apiError);
      return false;
    }
  }
  /**
   * --------------------------------
   * Login Institute
   * --------------------------------
   */
  public async login(values: {
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      if (!values?.email || !values?.password) {
        warningToast("Please provide both email and password");
        return false;
      }

      const response = await signIn("institute-login", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      console.log("Login response:", response);

      // ❌ Invalid credentials → NextAuth sets response.error
      if (response?.error) {
        try {
          const parsed = JSON.parse(response.error);
          errorToast(parsed.message || "Invalid login");
        } catch {
          errorToast(response.error || "Login failed");
        }
        return false;
      }

      // ✅ SUCCESS
      successToast("Logged in successfully!", {
        description: "Redirected to institute dashboard ...",
      });

      return true;
    } catch (err) {
      errorToast("Something went wrong. Please try again.");
      console.error("Login error:", err);
      return false;
    }
  }

  /**
   * --------------------------------
   * Verify OTP
   * --------------------------------
   */
  public async codeVerify(
    code: string,
    email: string
  ): Promise<ApiResponse<any>> {
    const payload = { code, identifier: email };
    console.log("InstituteConf - request payload:", payload);

    // 1️⃣ Create the request promise (typed correctly)
    const request = apiClient.post<ApiResponse<any>>(
      "institute/verify-code",
      payload
    );

    // 2️⃣ Trigger promise toast (do NOT return it)
    promiseToast(request, {
      loading: "Verifying your code...",
      success: (res) => {
        if (!res.success) return "Invalid verification code";
        if (res?.isVerified)
          return res.message || "Email verified successfully";
        return "Verification successful!";
      },
      error: (err) => err?.message || "Error verifying code",
    });

    // 3️⃣ Await the actual API result and return it
    try {
      const response = await request;
      return response;
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Error verifying code",
        data: null,
      };
    }
  }

  /**
   * --------------------------------
   * Resend OTP
   * --------------------------------
   */
  public async ResendVerifyCode(email: string): Promise<ApiResponse<any>> {
    const payload = {
      identifier: email,
    };

    try {
      console.log("InstituteConf - resend payload:", payload);

      const response = await apiClient.post<ApiResponse<any>>(
        "institute/send-code",
        payload
      );

      console.log("InstituteConf - resend response:", response);

      if (!response?.success) {
        errorToast(response?.error || "Unable to resend code");
      } else {
        successToast("Verification code sent again");
      }

      return (
        response || {
          success: false,
          error: "Empty response from server",
          data: null,
        }
      );
    } catch (err: any) {
      console.log("InstituteConf - resend caught error:", err);

      errorToast(err?.message || "Error resending code");

      return {
        success: false,
        error: err?.message || "Error resending code",
        data: null,
      };
    }
  }
}

export const InstituteConf = new Institute();

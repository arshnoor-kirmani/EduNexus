import InstituteModel from "@/models/InstituteSchema";
import { apiClient } from "./ApiClient";
import { errorToast, successToast } from "@/components/Custom/Utils/Toast";
import {
  InstituteCheckEmailResponse,
  InstituteCodeResponse,
} from "@/types/api/institute/institute-api";
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
  public async register(
    values: any
  ): Promise<
    ApiResponse<{ institute_id: string | null; institute_name: string | null }>
  > {
    try {
      const res = await apiClient.post<
        ApiResponse<{ institute_id: string; institute_name: string }>
      >("institute", { ...values });

      if (!res.success) throw new Error(res.error);

      return res;
    } catch (err: any) {
      return {
        success: false,
        error: "Error registering institute",
        data: {
          institute_id: null,
          institute_name: null,
        },
      };
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
    try {
      const payload = {
        code,
        identifier: email,
      };

      console.log("InstituteConf - request payload:", payload);

      const response = await apiClient.post<ApiResponse<any>>(
        "institute/verify-code",
        payload
      );

      console.log("InstituteConf - API response:", response);

      if (!response?.success) {
        errorToast(response?.error || "Invalid Code");
      } else {
        successToast("Email Verified Successfully");
      }

      return (
        response || {
          success: false,
          error: "Empty response from server",
          data: null,
        }
      );
    } catch (err: any) {
      console.log("InstituteConf - caught error:", err);

      errorToast(err?.message || "Error verifying OTP");

      return {
        success: false,
        error: err?.message || "Error verifying code",
        data: null,
      };
    }
  }
}

export const InstituteConf = new Institute();

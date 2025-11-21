import InstituteModel from "@/app/models/InstituteSchema";
// import { apiClient } from "@/helper/apiHelper/ApiClient";
// import { ApiResponse } from "@/types/api/helper/api-response";
import {
  InstituteCheckEmailResponse,
  InstituteCodeResponse,
} from "@/types/api/institute/institute-api";
import { apiClient } from "./ApiClient";

class Institute {
  private IGNORE_WORDS: string[];
  constructor() {
    this.IGNORE_WORDS = ["of", "the", "and", "&"];
  }

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

  public async generateInstituteCode(
    institute_name: string
  ): Promise<InstituteCodeResponse> {
    try {
      if (!institute_name || typeof institute_name !== "string") {
        throw new Error("Invalid institute name");
      }

      // NEW initials logic
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

        if (!Number.isNaN(parsed)) {
          nextNumber = parsed + 1;
        }
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
      return {
        success: false,
        error: "Error checking email",
        data: { isRegistered: false },
      };
    }
  }
}
export const InstituteConf = new Institute();

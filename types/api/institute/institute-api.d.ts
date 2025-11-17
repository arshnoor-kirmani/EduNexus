import type { Institute } from "@/types/models/institute.model";

// =============================
// Generic Response
// =============================
export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// =============================
// POST — Create / Resend Verification
// =============================
export interface PostCreateInstituteRequest {
  name: string;
  Email: string;
  password: string;
  institute_name: string;
}

export interface PostCreateInstituteResponse {
  userId?: string;
}

// =============================
// GET — Get Institute by email/code
// =============================
export interface GetInstituteRequest {
  identifier: string;
}

export interface GetInstituteResponse {
  user: Institute;
}

// =============================
// PUT — Update Institute Info
// =============================
export interface PutUpdateInstituteRequest {
  institute_code: string;
  info?: Record<string, any>;
}

export interface PutUpdateInstituteResponse {
  user: Institute;
}

// =============================
// DELETE — Delete Institute
// =============================
export interface DeleteInstituteRequest {
  institute_code: string;
  password: string;
}

export interface DeleteInstituteResponse {
  deleted?: boolean;
}

import { Document } from "mongoose";

export interface CourseOption {
  value: string;
  label: string;
  base_fee: number;
  offers: string[];
  syllabus: Record<string, any>;
}

export interface CourseGroup {
  title: string;
  courses: CourseOption[];
}

export interface Rules {
  all_permissions: boolean;
  profile_edit: boolean;
  send_message: boolean;
  inbox_message: boolean;
  website_setting: boolean;
  add_teacher: boolean;
  edit_teacher: boolean;
  delete_teacher: boolean;
  salary_management: boolean;
  add_student: boolean;
  edit_student: boolean;
  delete_student: boolean;
  fees_management: boolean;
  result_permission: boolean;
  attendance: boolean;
  manage_users: boolean;
  settings: boolean;
  show_student: boolean;
  show_teacher: boolean;
}

export interface Institute extends Document {
  information: {
    isNewInstitute?: boolean;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    country: string | null;
    mobile: string | null;
    email: string | null;
    website: string | null;
    short_name: string | null;
    institute_name: string;
    institute_code: string | null;
    currency: string | null;
    timezone: string | null;
    working_hours: string | null;
    institute_type: string | null;
    affiliation: string | null;
    established_year: number;
    institute_code: string | null;
    logo: string | null;
    profile_url: string | null;
  };
  username: string;
  email: string;
  password: string;
  user_type: "institute";
  isVerified: boolean;
  verifyCode: string | null;
  verifyCodeExpiry: Date | null;
  forgotPasswordCode: string | null;
  forgotPasswordCodeExpiry: Date | null;
  forgotPasswordRequest: boolean;
  rules: Rules;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
  status: "active" | "inactive" | "blocked" | "pending";
}

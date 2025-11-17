import { Institute } from "@/types/models/institute.model";
import { Schema, model, models, Model } from "mongoose";
// ------------------ SCHEMA ------------------

const InstituteSchema = new Schema<Institute>(
  {
    information: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
      country: { type: String, default: "" },
      mobile: { type: String, default: "" },
      email: { type: String, default: "" },
      website: { type: String, default: "" },
      short_name: { type: String, default: "" },
      institute_name: { type: String, default: "" },
      institute_code: { type: String, default: "" },
      currency: { type: String, default: "INR" },
      timezone: { type: String, default: "Asia/Kolkata" },
      working_hours: { type: String, default: "9AM - 5PM" },
      institute_type: { type: String, default: "" },
      affiliation: { type: String, default: "" },
      established_year: { type: Number, default: new Date().getFullYear() },
      logo: { type: String, default: "" },
      profile_url: { type: String, default: "" },
    },

    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, default: "institute" },
    isVerified: { type: Boolean, default: false },
    verifyCode: { type: String, default: null },
    verifyCodeExpiry: { type: Date, default: null },
    forgotPasswordCode: { type: Number, default: null },
    forgotPasswordCodeExpiry: { type: Date, default: null },
    forgotPasswordRequest: { type: Boolean, default: false },

    rules: {
      all_permissions: { type: Boolean, default: true },
      profile_edit: { type: Boolean, default: true },
      send_message: { type: Boolean, default: true },
      inbox_message: { type: Boolean, default: true },
      website_setting: { type: Boolean, default: true },
      add_teacher: { type: Boolean, default: true },
      edit_teacher: { type: Boolean, default: true },
      delete_teacher: { type: Boolean, default: true },
      salary_management: { type: Boolean, default: true },
      add_student: { type: Boolean, default: true },
      edit_student: { type: Boolean, default: true },
      delete_student: { type: Boolean, default: true },
      fees_management: { type: Boolean, default: true },
      result_permission: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      manage_users: { type: Boolean, default: true },
      settings: { type: Boolean, default: true },
      show_student: { type: Boolean, default: true },
      show_teacher: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);
// INDEXES
InstituteSchema.index({ email: 1 }, { unique: true });
InstituteSchema.index(
  { "information.institute_code": 1 },
  { unique: true, sparse: true }
);
InstituteSchema.index(
  { "information.profile_url": 1 },
  { unique: true, sparse: true }
);

InstituteSchema.index({ institute_name: "text", institute_short_name: "text" });

InstituteSchema.index({
  "information.city": 1,
  "information.state": 1,
  "information.country": 1,
});

InstituteSchema.index({ createdAt: -1 });
InstituteSchema.index({ updatedAt: -1 });

const InstituteModel =
  (models.Institute as Model<Institute>) ||
  model<Institute>("Institute", InstituteSchema);

export default InstituteModel;

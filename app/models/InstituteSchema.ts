import { Institute } from "@/types/models/institute.model";
import { Schema, model, models, Model } from "mongoose";
// ------------------ SCHEMA ------------------

const InstituteSchema = new Schema<Institute>(
  {
    information: {
      address: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
      country: { type: String, default: null },
      mobile: { type: String, default: null },
      email: { type: String, default: null },
      website: { type: String, default: null },
      short_name: { type: String, default: null },
      institute_name: { type: String, default: null },
      institute_code: { type: String, default: null },
      currency: { type: String, default: "INR" },
      timezone: { type: String, default: "Asia/Kolkata" },
      working_hours: { type: String, default: "9AM - 5PM" },
      institute_type: { type: String, default: null },
      affiliation: { type: String, default: null },
      established_year: { type: Number, default: new Date().getFullYear() },
      logo: { type: String, default: null },
      profile_url: { type: String, default: null },
    },

    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    user_type: { type: String, default: "institute", required: true },
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

InstituteSchema.index({
  "information.institute_name": "text",
  "information.short_name": "text",
});

InstituteSchema.index({
  "information.city": 1,
  "information.state": 1,
  "information.country": 1,
});

InstituteSchema.index({ isVerified: -1 });
InstituteSchema.index({ createdAt: -1 });
InstituteSchema.index({ updatedAt: -1 });

const InstituteModel =
  (models?.Institute as Model<Institute>) ??
  model<Institute>("Institute", InstituteSchema);

export default InstituteModel;

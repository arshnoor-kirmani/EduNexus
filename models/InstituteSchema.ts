import { Institute } from "@/types/models/institute.model";
import { Schema, model, models, Model } from "mongoose";

const InstituteSchema = new Schema<Institute>(
  {
    information: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      mobile: String,
      email: String,
      website: String,
      short_name: String,
      institute_name: { type: String, required: true },
      institute_code: { type: String },
      currency: { type: String, default: "INR" },
      timezone: { type: String, default: "Asia/Kolkata" },
      working_hours: { type: String, default: "9AM - 5PM" },
      institute_type: String,
      affiliation: String,
      established_year: { type: Number, default: new Date().getFullYear() },
      logo: String,
      profile_url: String,
    },

    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    user_type: { type: String, default: "institute", required: true },

    isVerified: { type: Boolean, default: false },
    verifyCode: String,
    verifyCodeExpiry: Date,
    forgotPasswordCode: Number,
    forgotPasswordCodeExpiry: Date,
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

    lastLogin: Date,

    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "pending"],
      default: "active",
    },
  },
  { timestamps: true }
);

// indexes
InstituteSchema.index({ email: 1 }, { unique: true });
InstituteSchema.index({ "information.email": 1 }, { sparse: true });
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
InstituteSchema.index({ isVerified: -1 });
InstituteSchema.index({ createdAt: -1 });
InstituteSchema.index({ updatedAt: -1 });

const InstituteModel =
  (models?.Institute as Model<Institute>) ??
  model<Institute>("Institute", InstituteSchema);

export default InstituteModel;

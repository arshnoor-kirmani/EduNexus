import { Schema, model, models } from "mongoose";

const TeacherSchema = new Schema(
  {
    institute_id: {
      type: Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    personal: {
      first_name: { type: String, required: true },
      last_name: { type: String, default: "" },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: "male",
      },
      dob: { type: Date, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      address: { type: String, default: null },
    },

    professional: {
      designation: { type: String, required: true },
      joining_date: { type: Date, required: true },
      department: { type: String, default: null },
      qualifications: { type: [String], default: [] },
    },

    salary: {
      base_salary: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },

    access_role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
  },
  { timestamps: true }
);

TeacherSchema.index({ email: 1, institute_id: 1 }, { unique: true });

export const TeacherModel = models.Teacher ?? model("Teacher", TeacherSchema);

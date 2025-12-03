import { Schema, model, models } from "mongoose";

const StudentSchema = new Schema(
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
      email: { type: String, default: null },
      address: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
    },

    academic: {
      roll_no: { type: String, required: true },
      class_name: { type: String, required: true },
      section: { type: String, default: null },
      admission_date: { type: Date, required: true },
      previous_school: { type: String, default: null },
      course: {
        group_title: String,
        course_title: String,
        base_fee: Number,
      },
    },

    documents: {
      profile_photo: { type: String, default: null },
      aadhaar: { type: String, default: null },
      birth_certificate: { type: String, default: null },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "left", "terminated"],
      default: "active",
    },

    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

StudentSchema.index({ institute_id: 1 });
StudentSchema.index(
  { "academic.roll_no": 1, institute_id: 1 },
  { unique: true }
);

export const StudentModel = models.Student ?? model("Student", StudentSchema);

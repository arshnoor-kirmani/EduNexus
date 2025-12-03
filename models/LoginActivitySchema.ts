import { Schema, model, models } from "mongoose";

const LoginActivitySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["institute", "student", "teacher"],
      required: true,
    },

    institute_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    device: {
      userAgent: String,
      os: String,
      browser: String,
    },

    ip: {
      type: String,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

export const LoginActivityModel =
  models.LoginActivity || model("LoginActivity", LoginActivitySchema);

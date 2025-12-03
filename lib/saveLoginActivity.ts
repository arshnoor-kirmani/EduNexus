import { LoginActivityModel } from "@/models/LoginActivitySchema";

export async function saveLoginActivity({
  user,
  role,
  institute_id,
  ip,
  userAgent,
}: {
  user: any;
  role: string;
  institute_id?: string | null;
  ip: string;
  userAgent: string;
}) {
  await LoginActivityModel.create({
    user_id: user._id,
    role,
    institute_id: institute_id || null,
    ip,
    device: {
      userAgent,
    },
    status: "success",
  });
}

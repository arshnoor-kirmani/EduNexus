import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export const bcryptRounds = Number(process.env.OTP_HASH_SALT_ROUNDS ?? 10);

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, bcryptRounds);
}

export async function verifyOtpHash(
  code: string,
  hash: string
): Promise<boolean> {
  console.log({ code, hash });
  return bcrypt.compare(code, hash);
}

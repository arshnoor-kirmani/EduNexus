import UniversalLogin from "@/components/custom/auth/universal-login";
import React from "react";

export default function page() {
  return (
    <div>
      <UniversalLogin userType="institute" />
      <UniversalLogin userType="student" />
      <UniversalLogin userType="teacher" />
    </div>
  );
}

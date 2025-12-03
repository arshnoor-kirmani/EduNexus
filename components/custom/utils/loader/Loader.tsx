"use client";

import { Loader2 } from "lucide-react";
import { useGlobalLoader } from "./glober-loader-provider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Loader() {
  const { isLoading } = useGlobalLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Loader2 className="w-12 h-12 animate-spin text-white" />
    </div>
  );
}

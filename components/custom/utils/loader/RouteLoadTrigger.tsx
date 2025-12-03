"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoader } from "./glober-loader-provider";

export default function RouteLoadTrigger() {
  const pathname = usePathname();
  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    // Show loader as soon as route changes
    showLoader();
    // Hide loader after a smooth delay
    const timer = setTimeout(() => {
      hideLoader();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

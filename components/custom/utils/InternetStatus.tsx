"use client";

import { useEffect, useRef } from "react";
import { useAutoInternetCheck } from "@/hooks/useAutoInternetCheck";
import { toast } from "sonner";

export default function InternetStatus() {
  const online = useAutoInternetCheck();

  // Store previous value
  const prevStatus = useRef<boolean | null>(null);

  useEffect(() => {
    // Avoid firing on the very first load
    if (prevStatus.current === null) {
      prevStatus.current = online;
      return;
    }

    // Show toast only when value changes
    if (online === false && prevStatus.current !== false) {
      toast.warning("You are offline", { duration: 1000 });
    }

    if (online === true && prevStatus.current !== true) {
      toast.success("Back online", { duration: 1000 });
    }

    // Update previous state
    prevStatus.current = online;
  }, [online]);

  return null;
}

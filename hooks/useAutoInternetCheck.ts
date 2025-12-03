"use client";

import { useEffect, useState } from "react";

export function useAutoInternetCheck() {
  const [online, setOnline] = useState(true);

  async function check() {
    const result = await fetch("https://www.google.com/favicon.ico", {
      method: "HEAD",
      mode: "no-cors",
    })
      .then(() => true)
      .catch(() => false);

    setOnline(result);
  }

  useEffect(() => {
    // Listen to browser events too
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(check, 3000); // Auto-check every 3 sec

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

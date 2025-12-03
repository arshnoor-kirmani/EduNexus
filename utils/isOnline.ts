export async function isOnline(): Promise<boolean> {
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 1500);

    await fetch("https://www.google.com/favicon.ico", {
      mode: "no-cors",
      signal: controller.signal,
    });

    return true;
  } catch {
    return false;
  }
}

import { toast } from "sonner";
import {
  CheckCircle,
  CircleAlert,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

type ToastTypes = "success" | "error" | "info" | "warning" | "loading";

interface ToastOptions {
  description?: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

export function showToast(
  type: ToastTypes,
  message: string,
  options: ToastOptions = {}
) {
  const { description, duration = 3000, actionLabel, onAction } = options;

  // reusable config
  const baseConfig = {
    description,
    duration,
    className:
      "rounded-xl border shadow-lg flex items-start gap-3 p-4 text-sm font-medium",
    action:
      actionLabel && onAction
        ? {
            label: actionLabel,
            onClick: () => onAction(),
          }
        : undefined,
  };

  switch (type) {
    case "success":
      return toast.success(message, {
        ...baseConfig,
        icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        className:
          "bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300 rounded-xl shadow-md",
      });

    case "error":
      return toast.error(message, {
        ...baseConfig,
        icon: <CircleAlert className="text-red-600 w-5 h-5" />,
        className:
          "bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300 rounded-xl shadow-md",
      });

    case "info":
      return toast(message, {
        ...baseConfig,
        icon: <Info className="text-blue-600 w-5 h-5" />,
        className:
          "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 rounded-xl shadow-md",
      });

    case "warning":
      return toast.warning(message, {
        ...baseConfig,
        icon: <AlertTriangle className="text-amber-600 w-5 h-5" />,
        className:
          "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 rounded-xl shadow-md",
      });

    case "loading":
      return toast.loading(message, {
        ...baseConfig,
        icon: <Loader2 className="animate-spin w-5 h-5 text-gray-600" />,
        className:
          "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 rounded-xl shadow-md",
        duration: undefined, // loading stays until dismiss
      });

    default:
      return toast(message, baseConfig);
  }
}

// ----------------------------------------------
// Helpers
// ----------------------------------------------
export const successToast = (msg: string, opts?: ToastOptions) =>
  showToast("success", msg, opts);

export const errorToast = (msg: string, opts?: ToastOptions) =>
  showToast("error", msg, opts);

export const infoToast = (msg: string, opts?: ToastOptions) =>
  showToast("info", msg, opts);

export const warningToast = (msg: string, opts?: ToastOptions) =>
  showToast("warning", msg, opts);

export const loadingToast = (msg: string, opts?: ToastOptions) =>
  showToast("loading", msg, opts);
// ----------------------------------------------
interface PromiseToastOptions {
  loading: string;
  success: string | ((data: any) => string);
  error: string | ((err: any) => string);
}
interface PromiseToastOptions {
  loading: string;
  success: string | ((data: any) => string);
  error: string | ((err: any) => string);
}

export function promiseToast<T>(
  promise: Promise<T>,
  { loading, success, error }: PromiseToastOptions
) {
  return toast.promise(promise, {
    loading,

    success: (data) =>
      typeof success === "function" ? success(data) : success,

    error: (err) => (typeof error === "function" ? error(err) : error),
  });
}

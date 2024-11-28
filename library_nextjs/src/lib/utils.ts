import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleApiError = ({
  error,
  toastMessage = "Có lỗi không xác định",
  setErrorForm,
  duration,
}: {
  error: any;
  toastMessage?: string;
  setErrorForm?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setErrorForm) {
    setErrorForm(error.payload.field, {
      type: "server",
      message: error.payload.message,
    });
    toast.error(error.payload.message, { duration: duration ?? 5000 });
  } else {
    toast.error(toastMessage, {
      duration: duration ?? 5000,
    });
  }
};

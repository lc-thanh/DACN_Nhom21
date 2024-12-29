import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import jwt from "jsonwebtoken";

type PayloadJWT = {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  jti: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
};

export const decodeJWT = (token: string) => {
  const payloadJWT = jwt.decode(token) as PayloadJWT;
  if (!payloadJWT) return null;
  return {
    phone:
      payloadJWT["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    jti: payloadJWT.jti,
    role: payloadJWT[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
    exp: payloadJWT.exp,
  };
};

export const redirectToHomePageByRole = (role: string) => {
  if (role === "Member") {
    return "/member";
  }
  return "/dashboard";
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function phoneFormatTest(phone: string) {
  const phonePattern: RegExp = /^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$/;
  return phonePattern.test(phone);
}

export function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return format(date, "HH:mm - dd/MM/yyyy");
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
  } else if (error.status === 423) {
    toast.error(
      "Tài khoản của bạn đã bị khóa, vui lòng liên hệ thư viện để biết thêm thông tin...",
      {
        duration: duration ?? 5000,
        description: "Số điện thoại: 0123456789",
      }
    );
  } else {
    toast.error(toastMessage, {
      duration: duration ?? 5000,
    });
  }
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage < 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  if (currentPage === 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage > totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  if (currentPage === totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

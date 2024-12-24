"use client";

import authApiRequests from "@/apiRequests/auth";
import { clientTokens } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    // Kiểm tra accessToken từ params để phòng trường hợp người dùng truy cập trực tiếp vào trang này và bị logout
    if (accessToken === clientTokens.accessToken) {
      clientTokens.accessToken = "";
      clientTokens.refreshToken = "";

      authApiRequests
        .logoutFromNextClientToNextServer(true, signal)
        .then((_res) => {
          router.push("/login?redirectFrom=" + pathname);
        });
    }

    return () => {
      controller.abort(); // Sử dụng abort để tránh bị gọi duplicate
    };
  }, [accessToken, pathname, router]);

  return <div></div>;
}

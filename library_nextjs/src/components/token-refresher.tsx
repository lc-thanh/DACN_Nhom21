"use client";

import authApiRequests from "@/apiRequests/auth";
import { clientTokens } from "@/lib/http";
import { differenceInMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

export default function TokenRefresher() {
  const router = useRouter();

  const refreshTokenFunc = useCallback(async () => {
    try {
      const { payload } =
        await authApiRequests.refreshTokenFromNextClientToNextServer();
      clientTokens.accessToken = payload.data.accessToken;
      clientTokens.refreshToken = payload.data.refreshToken;
      clientTokens.expiresAt = payload.data.expiresAt;
    } catch (_error) {
      authApiRequests.logoutFromNextClientToNextServer(true).then((_res) => {
        router.push("/login?redirectFrom=/force-logout");
      });
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const expiresAt = new Date(clientTokens.expiresAt);
      if (differenceInMinutes(expiresAt, now) < 1) {
        await refreshTokenFunc();
      }
    }, 1000 * 30);
    return () => clearInterval(interval);
  }, [refreshTokenFunc]);

  return null;
}

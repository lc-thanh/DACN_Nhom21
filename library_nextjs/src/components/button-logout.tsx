"use client";

import authApiRequests from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ButtonLogout() {
  const router = useRouter();

  const handleClick = async () => {
    try {
      await authApiRequests.logoutFromNextClientToNextServer();
      toast.success("Đăng xuất thành công!");
      router.push("/login");
    } catch (error) {
      handleApiError({ error });
    }
  };

  return <Button onClick={handleClick}>Đăng xuất</Button>;
}

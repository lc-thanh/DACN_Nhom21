"use client";

import { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import authApiRequests from "@/apiRequests/auth";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

interface AccountMenuProps {
  accountName: string;
}

export default function AccountMenu({ accountName }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApiRequests.logoutFromNextClientToNextServer();
      toast.success("Đăng xuất thành công!");
      router.push("/login");
    } catch (error) {
      handleApiError({ error });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="min-w-fit justify-between px-4">
          <span>{accountName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-left"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <User className="mr-2 h-4 w-4" />
          Thông tin tài khoản
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-left"
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </PopoverContent>
    </Popover>
  );
}

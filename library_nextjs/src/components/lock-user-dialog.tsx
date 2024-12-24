"use client";

import accountApiRequests from "@/apiRequests/account";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function LockUserDialog({
  id,
  fullName,
  callback,
  open,
  setOpen,
}: {
  id: string;
  fullName: string;
  callback: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    // Call API to delete book
    setLoading(true);
    try {
      await accountApiRequests.lock(id);
      setOpen(false);
      toast.success(`Đã khóa tài khoản ${fullName}!`);
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có muốn khóa tài khoản {fullName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sau khi khóa, tài khoản sẽ không thể sử dụng được các chức năng
            trong hệ thống, bạn có chắc chắn muốn khóa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            onClick={() => {
              handleDelete();
            }}
            className="bg-red-500 text-red-50 hover:bg-red-600"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Khóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

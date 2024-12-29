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

export default function ResetPasswordDialog({
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
      await accountApiRequests.resetPassword(id);
      setOpen(false);
      toast.success(`Đặt lại mật khẩu cho ${fullName} thành công!`);
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi đang đặt lại mật khẩu!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đặt lại mật khẩu cho {fullName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Mật khẩu sẽ đặt về mặc định là{" "}
            <span className="font-bold text-indigo-500 hover:underline">
              Abc123!@#
            </span>
            , bạn có chắc chắn?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            onClick={() => {
              handleDelete();
            }}
            className="bg-indigo-500 text-indigo-50 hover:bg-indigo-600"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Đặt lại
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
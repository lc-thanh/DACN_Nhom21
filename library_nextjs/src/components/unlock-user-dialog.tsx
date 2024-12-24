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

export default function UnlockUserDialog({
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
      await accountApiRequests.unlock(id);
      setOpen(false);
      toast.success(`Đã mở khóa tài khoản ${fullName}!`);
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
            Bạn có muốn mở khóa tài khoản {fullName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản sẽ có thể sử dụng các chức năng của hệ thống sau khi mở
            khóa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            onClick={() => {
              handleDelete();
            }}
            className="bg-green-500 text-green-50 hover:bg-green-600"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Mở khóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import loanApiRequests from "@/apiRequests/loan";
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

export default function UnreturnedLoanDialog({
  id,
  loanCode,
  callback,
  open,
  setOpen,
}: {
  id: string;
  loanCode: string;
  callback: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);

  const handleReturn = async () => {
    setLoading(true);
    try {
      await loanApiRequests.toUnreturned(id);
      setOpen(false);
      toast.success(`Vô hiệu phiếu ${loanCode} thành công!`);
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
          <AlertDialogTitle>Vô hiệu phiếu {loanCode}?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác, bạn có chắc chắn không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            variant="default"
            onClick={() => {
              handleReturn();
            }}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Xác nhận
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

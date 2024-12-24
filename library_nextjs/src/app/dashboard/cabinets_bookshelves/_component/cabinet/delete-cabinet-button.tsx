"use client";

import cabinetApiRequests from "@/apiRequests/cabinet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeleteCabinetButton({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    // Call API to delete book
    setLoading(true);
    try {
      await cabinetApiRequests.delete(id);
      setOpen(false);
      toast.success("Xóa tủ sách thành công!");
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi xóa tủ sách!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 size={20} className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa tủ sách này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
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
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

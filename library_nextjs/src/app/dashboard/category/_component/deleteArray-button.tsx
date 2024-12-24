"use client";

import categoryApiRequests from "@/apiRequests/category";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, handleApiError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeleteCategoriesButton({
  checkedItems,
  callback,
}: {
  checkedItems: { [key: string]: boolean };
  callback: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    const ids = Object.keys(checkedItems).filter((key) => checkedItems[key]);

    // Call API to delete book
    setLoading(true);
    try {
      await categoryApiRequests.deleteArray(ids);
      setOpen(false);
      toast.success("Xóa danh mục thành công!");
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi xóa danh mục!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn(
            "border-red-500",
            Object.values(checkedItems).some((value) => value)
              ? "me-2"
              : "hidden"
          )}
        >
          Xóa
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal bg-red-100 hover:bg-red-100 text-red-500"
          >
            {Object.values(checkedItems).filter(Boolean).length}
          </Badge>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có muốn xóa {Object.values(checkedItems).filter(Boolean).length}{" "}
            danh mục này?
          </AlertDialogTitle>
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

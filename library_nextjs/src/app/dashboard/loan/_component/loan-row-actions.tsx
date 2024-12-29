import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookCopy,
  BookmarkCheck,
  Ellipsis,
  Trash2,
  UndoDot,
} from "lucide-react";

export default function LoanRowActions({
  id,
  status,
  setActionId,
  setOpenApproveDialog,
  setOpenOnLoanDialog,
  setOpenDeleteDialog,
  setOpenReturnDialog,
}: {
  id: string;
  status: string;
  setActionId: (id: string) => void;
  setOpenApproveDialog: (open: boolean) => void;
  setOpenOnLoanDialog: (open: boolean) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenReturnDialog: (open: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenReturnDialog(true);
            }}
            disabled={status !== "OnLoan" && status !== "Overdue"}
          >
            <UndoDot />
            Trả sách
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenApproveDialog(true);
            }}
            className="text-green-500"
            disabled={status !== "Pending"}
          >
            <BookmarkCheck />
            Tiếp nhận phiếu
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenOnLoanDialog(true);
            }}
            className="text-blue-500"
            disabled={status !== "Approved"}
          >
            <BookCopy />
            Tạo phiếu
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenDeleteDialog(true);
            }}
            className="text-red-500"
            disabled={status !== "Returned"}
          >
            <Trash2 />
            Xóa phiếu
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
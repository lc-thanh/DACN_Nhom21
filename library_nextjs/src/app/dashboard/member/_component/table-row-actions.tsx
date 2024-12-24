import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  FilePenLine,
  Lock,
  LockOpen,
  RectangleEllipsis,
  Trash2,
} from "lucide-react";

export default function TableRowActions({
  id,
  fullName,
  islocked,
  setActionId,
  setOpenUpdateDrawer,
  setOpenDeleteDialog,
  setOpenResetPasswordDialog,
  setOpenLockDialog,
  setOpenUnlockDialog,
}: {
  id: string;
  fullName: string;
  islocked: boolean;
  callback: () => void;
  setActionId: (id: string) => void;
  setOpenUpdateDrawer: (open: boolean) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenResetPasswordDialog: (open: boolean) => void;
  setOpenLockDialog: (open: boolean) => void;
  setOpenUnlockDialog: (open: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenUpdateDrawer(true);
            }}
          >
            <FilePenLine />
            Sửa thông tin
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 />
            Xóa thành viên
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenResetPasswordDialog(true);
            }}
          >
            <RectangleEllipsis />
            Đặt lại mật khẩu
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Khóa/Mở khóa</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    setActionId(id);
                    setOpenLockDialog(true);
                  }}
                  disabled={islocked}
                >
                  <Lock />
                  Khóa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActionId(id);
                    setOpenUnlockDialog(true);
                  }}
                  disabled={!islocked}
                >
                  <LockOpen />
                  Mở khóa
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>More...</DropdownMenuItem> */}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

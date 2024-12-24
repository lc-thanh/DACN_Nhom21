import UpdateMemberForm from "@/app/dashboard/member/_component/update-member-form";
import UpdateStaffForm from "@/app/dashboard/staff/_component/update-staff-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function UpdateStaffDrawer({
  id,
  callback,
  open,
  setOpen,
}: {
  id: string;
  callback: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Cập nhật nhân sự</DrawerTitle>
            <DrawerDescription>
              Chỉnh sửa thông tin biểu mẫu để cập nhật nhân sự
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <UpdateStaffForm id={id} callback={callback} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Hủy</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

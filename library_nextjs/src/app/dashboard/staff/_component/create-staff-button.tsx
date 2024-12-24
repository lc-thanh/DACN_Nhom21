import CreateStaffForm from "@/app/dashboard/staff/_component/create-staff-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";

export default function CreateStaffButton({
  callback,
}: {
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <Plus />
          Thêm nhân sự
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Tạo nhân sự mới</DrawerTitle>
            <DrawerDescription>
              Điền biểu mẫu sau để tạo nhân sự mới
              <br />
              <span className="text-red-500">Lưu ý!</span> Mật khẩu tạo ra mặc
              định là <span className="font-bold">Abc123!@#</span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-2 pb-0">
            <CreateStaffForm callback={callback} />
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

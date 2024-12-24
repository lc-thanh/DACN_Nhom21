import CreateCabinetForm from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/create-cabinet-form";
import CreateMemberForm from "@/app/dashboard/member/_component/create-member-form";
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

export default function CreateMemberButton({
  callback,
}: {
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <Plus />
          Thêm thành viên
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Tạo thành viên mới</DrawerTitle>
            <DrawerDescription>
              Điền biểu mẫu sau để tạo thành viên mới
              <br />
              <span className="text-red-500">Lưu ý!</span> Mật khẩu tạo ra mặc
              định là <span className="font-bold">Abc123!@#</span>
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-2 pb-0">
            <CreateMemberForm callback={callback} />
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

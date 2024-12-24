import CreateCabinetForm from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/create-cabinet-form";
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

export default function CreateCabinetButton({
  callback,
}: {
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <Plus />
          Thêm tủ sách
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Tạo tủ sách mới</DrawerTitle>
            <DrawerDescription>
              Điền biểu mẫu sau để tạo tủ mới
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <CreateCabinetForm callback={callback} />
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

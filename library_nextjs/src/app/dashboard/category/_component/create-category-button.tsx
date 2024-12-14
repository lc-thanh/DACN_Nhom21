import CreateCategoryForm from "@/app/dashboard/category/_component/create-category-form";
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

export default function CreateCategoryButton({
  callback,
}: {
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm">
          <Plus />
          Thêm danh mục
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Tạo danh mục mới</DrawerTitle>
          <DrawerDescription>
            Điền biểu mẫu sau để tạo danh mục mới
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <CreateCategoryForm callback={callback} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

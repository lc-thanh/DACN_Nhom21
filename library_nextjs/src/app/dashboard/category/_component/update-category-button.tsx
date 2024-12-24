import UpdateCategoryForm from "@/app/dashboard/category/_component/update-category-form";
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
import { FilePenLine } from "lucide-react";

export default function UpdateCategoryButton({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <FilePenLine size={20} className="text-blue-500" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Sửa danh mục</DrawerTitle>
            <DrawerDescription>
              Chỉnh sửa thông tin biểu mẫu để cập nhật danh mục
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <UpdateCategoryForm id={id} callback={callback} />
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

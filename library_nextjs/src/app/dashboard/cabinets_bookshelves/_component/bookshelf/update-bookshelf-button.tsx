import UpdateBookshelfForm from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/update-bookshelf-form";
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

export default function UpdateBookshelfButton({
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
            <DrawerTitle>Cập nhật ngăn sách</DrawerTitle>
            <DrawerDescription>
              Chỉnh sửa thông tin biểu mẫu để cập nhật ngăn sách
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <UpdateBookshelfForm id={id} callback={callback} />
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

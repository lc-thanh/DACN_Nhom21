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
import { Minus } from "lucide-react";

export default function WithdrawOutButton({
  callback,
}: {
  callback: () => void;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-none border-solid border-red-400 hover:bg-red-400 text-primary"
        >
          <Minus />
          Rút tiền ra
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Giao dịch ra</DrawerTitle>
            <DrawerDescription>
              Điền biểu mẫu sau để tạo giao dịch ra
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            {/* <WithdrawInForm callback={callback} /> */}
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

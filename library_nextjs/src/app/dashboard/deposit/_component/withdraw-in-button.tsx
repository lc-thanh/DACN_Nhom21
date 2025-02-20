import WithdrawInForm from "@/app/dashboard/deposit/_component/withdraw-in-form";
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

export default function WithdrawInButton({
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
          className="bg-none border-solid border-yellow-400 hover:bg-yellow-300 text-primary"
        >
          <Plus />
          Thêm tiền vào
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-xl max-h-[100vh]">
        <div className="overflow-y-auto h-full">
          <DrawerHeader>
            <DrawerTitle>Giao dịch vào</DrawerTitle>
            <DrawerDescription>
              Điền biểu mẫu sau để tạo giao dịch vào
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <WithdrawInForm callback={callback} />
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

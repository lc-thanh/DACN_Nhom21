import { BreadcrumbDeposit } from "@/app/dashboard/deposit/_component/breadcrumb-book";
import DepositInforCards from "@/app/dashboard/deposit/_component/deposit-infor-cards";
import { DepositTable } from "@/app/dashboard/deposit/_component/deposit-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DepositPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbDeposit />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Tiền quỹ cọc sách
      </h1>

      <DepositInforCards />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả giao dịch đối với quỹ tiền</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <DepositTable />
        </CardContent>
      </Card>
    </div>
  );
}

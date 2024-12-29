import { BreadcrumbLoan } from "@/app/dashboard/loan/_component/breadcrumb-loan";
import { LoanTable } from "@/app/dashboard/loan/_component/loan-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoanManagementPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbLoan />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý phiếu mượn
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả phiếu mượn của thành viên</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <LoanTable />
        </CardContent>
      </Card>
    </div>
  );
}
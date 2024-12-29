import { BreadcrumbMemberLoan } from "@/app/member/loan/_component/breadcrumb-loan";
import { MemberLoanTable } from "@/app/member/loan/_component/member-loan-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MemberLoanPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbMemberLoan />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Phiếu mượn của bạn
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả phiếu mượn của thành viên</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <MemberLoanTable />
        </CardContent>
      </Card>
    </div>
  );
}

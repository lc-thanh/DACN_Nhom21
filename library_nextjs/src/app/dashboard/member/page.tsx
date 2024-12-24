import { BreadcrumbMember } from "@/app/dashboard/member/_component/breadcrumb-member";
import { MemberTable } from "@/app/dashboard/member/_component/member-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MemberManagementPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbMember />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý thành viên
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Tất cả tài khoản người dùng đã đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <MemberTable />
        </CardContent>
      </Card>
    </div>
  );
}

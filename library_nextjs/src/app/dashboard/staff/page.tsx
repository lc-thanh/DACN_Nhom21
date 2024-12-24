import { BreadcrumbStaff } from "@/app/dashboard/staff/_component/breadcrumb-staff";
import { StaffTable } from "@/app/dashboard/staff/_component/staff-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function StaffManagementPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbStaff />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý nhân sự
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>Tất cả nhân sự trong thư viện</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <StaffTable />
        </CardContent>
      </Card>
    </div>
  );
}

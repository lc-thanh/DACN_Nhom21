import { BookTable } from "@/app/dashboard/book/book-table";
import { BreadcrumbBook } from "@/app/dashboard/book/breadcrum-book";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function BookManagementPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="mb-2">
        <BreadcrumbBook />
      </div>
      <h1 className="scroll-m-20 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý sách
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả các cuốn sách trong thư viện</CardDescription>
        </CardHeader>
        <CardContent>
          <BookTable />
        </CardContent>
      </Card>
    </div>
  );
}

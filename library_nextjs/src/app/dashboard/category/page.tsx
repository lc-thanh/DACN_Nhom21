import { BreadcrumbCategory } from "@/app/dashboard/category/_component/breadcrumb-category";
import CategoryTable from "@/app/dashboard/category/_component/category-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CategoryPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbCategory />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý danh mục
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            Danh mục các cuốn sách trong thư viện
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <CategoryTable />
        </CardContent>
      </Card>
    </div>
  );
}

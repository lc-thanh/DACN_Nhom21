import { BreadcrumbBookCreate } from "@/app/dashboard/book/_component/breadcrumb-book-create";
import CreateBookForm from "@/app/dashboard/book/_component/create-book-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateBookPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbBookCreate />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Thêm sách mới
      </h1>

      <Card className="max-w-[1200px] m-auto">
        <CardHeader>
          <CardTitle>Biểu mẫu</CardTitle>
          <CardDescription>Điền các thông tin của sách</CardDescription>
          <CardDescription>
            <span className="text-red-500">Lưu ý!</span> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <CreateBookForm />
        </CardContent>
      </Card>
    </div>
  );
}

import { BreadcrumbBookEdit } from "@/app/dashboard/book/_component/breadcrumb-book-edit";
import EditBookForm from "@/app/dashboard/book/_component/edit-book-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbBookEdit />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Cập nhật sách
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
          <EditBookForm bookId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import Link from "next/link";

export default function NotFoundBook() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <CircleAlert className="w-10 text-red-500" />
      <h2 className="text-xl font-semibold">Lỗi 404!</h2>
      <p>Không thể tìm thấy sách đã yêu cầu.</p>
      <Link href="/dashboard/book" className="mt-4">
        <Button>Trở lại</Button>
      </Link>
    </main>
  );
}

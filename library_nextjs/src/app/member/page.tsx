import { MemberBookTable } from "@/app/member/_component/member-book-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function MemberPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight mt-4">
        Chào mừng bạn!
      </h1>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả các cuốn sách trong thư viện</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <MemberBookTable />
        </CardContent>
      </Card>
    </div>
  );
}

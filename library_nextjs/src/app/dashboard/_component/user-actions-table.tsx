import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function UserActionsTable() {
  return (
    <Card className="flex flex-col mt-4">
      <CardHeader>
        <CardTitle>Lịch sử hoạt động</CardTitle>
        <CardDescription>Của các nhân viên</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0"></CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Lịch
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

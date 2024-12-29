import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserActionsTable from "@/app/dashboard/_component/user-actions-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export default function UserActionsCard() {
  return (
    <Card className="flex flex-col mt-4">
      <CardHeader>
        <CardTitle>Lịch sử hoạt động</CardTitle>
        <CardDescription>Của các nhân viên</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={3}
              rowCount={5}
              showViewOptions={false}
              withPagination={false}
            />
          }
        >
          <UserActionsTable />
        </Suspense>
      </CardContent>
    </Card>
  );
}

import BooksTable from "@/app/dashboard/book/_component/books-table";
import { searchParamsCache } from "@/app/dashboard/book/_lib/validations";
import { BreadcrumbBook } from "@/app/dashboard/book/breadcrum-book";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParams } from "@/types";
import { Suspense } from "react";

interface BookManagementPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BookManagementPage(
  props: BookManagementPageProps
) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

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
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
            // shrinkZero
          />
          {/* <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={6}
                searchableColumnCount={1}
                filterableColumnCount={2}
                cellWidths={[
                  "10rem",
                  "40rem",
                  "12rem",
                  "12rem",
                  "8rem",
                  "8rem",
                ]}
                // shrinkZero
              />
            }
          >
            <BooksTable />
          </Suspense> */}
        </CardContent>
      </Card>
    </div>
  );
}

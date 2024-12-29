"use client";

import bookApiRequests from "@/apiRequests/book";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleApiError } from "@/lib/utils";
import {
  BookPaginatedResType,
  BookType,
} from "@/schemaValidations/book.schema";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Pagination from "@/components/data-table/my-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import categoryApiRequests from "@/apiRequests/category";
import { CategoryType } from "@/schemaValidations/category.schema";
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";

export function MemberBookTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [bookPaginated, setBooksPaginated] = useState<
    BookPaginatedResType | undefined
  >(undefined);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const fetchBooks = useCallback(
    async ({ triggerLoading }: { triggerLoading: boolean }) => {
      try {
        const params = new URLSearchParams(searchParams);
        if (triggerLoading) setLoading(true);

        const [{ payload: paginatedBooks }, { payload: categories }] =
          await Promise.all([
            bookApiRequests.getBooks(params.toString()),
            categoryApiRequests.getCategories(),
          ]);
        if (paginatedBooks.items.length === 0) {
          toast.info("Không có sách để hiển thị!");
        }
        setBooksPaginated(paginatedBooks);
        setCategories(categories);
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Có lỗi xảy ra trong quá trình tải dữ liệu sách!",
        });
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    fetchBooks({ triggerLoading: true });
  }, [fetchBooks, searchParams]);

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm sách" />

          <TableFacetedFilter
            title="Danh mục"
            filterName="categoryIds"
            options={
              categories.map((category) => ({
                label: category.name,
                value: category.id,
                count: !searchParams.get("searchString")?.toString()
                  ? category.booksCount
                  : undefined,
              })) ?? []
            }
          />
        </div>
      </div>

      {loading ? (
        <DataTableSkeleton
          columnCount={8}
          rowCount={6}
          showViewOptions={false}
        />
      ) : (
        <Table className="text-center border">
          <TableHeader>
            <TableRow className="bg-primary-foreground">
              <TableHead className="text-center border-y">#</TableHead>
              <SortableTableHead
                orderName="Title"
                className="text-center border"
              >
                Tiêu đề
              </SortableTableHead>
              <TableHead className="text-center border">Ảnh</TableHead>
              <SortableTableHead
                orderName="Quantity"
                className="text-center border"
              >
                Số lượng
              </SortableTableHead>
              <SortableTableHead
                orderName="AvailableQuantity"
                className="text-center border"
              >
                Hiện có
              </SortableTableHead>
              <SortableTableHead
                orderName="TotalPages"
                className="text-center border"
              >
                Số trang
              </SortableTableHead>
              <TableHead className="text-center border">Tác giả</TableHead>
              <TableHead className="text-center border">Danh mục</TableHead>
              <TableHead className="text-center border">Ngăn sách</TableHead>
              <TableHead className="text-center border">Nhà xuất bản</TableHead>
              <SortableTableHead
                orderName="PublishedYear"
                className="text-center border"
              >
                Năm XB
              </SortableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookPaginated?.items.map((book: BookType, index) => (
              <TableRow key={book.id}>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="min-w-[150px] font-medium">
                  {book.title}
                </TableCell>
                <TableCell className="w-[150px] min-w-[100px]">
                  <Image
                    src={book.imageUrl}
                    width={150}
                    height={0}
                    alt="Book cover image"
                  />
                </TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>{book.availableQuantity}</TableCell>
                <TableCell>{book.totalPages}</TableCell>
                <TableCell>{book.authorName}</TableCell>
                <TableCell>{book.categoryName}</TableCell>
                <TableCell>{book.bookShelfName}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publishedYear}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={bookPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

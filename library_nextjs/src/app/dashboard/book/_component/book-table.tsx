"use client";

import bookApiRequests from "@/apiRequests/book";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, handleApiError } from "@/lib/utils";
import {
  BookPaginatedResType,
  BookType,
} from "@/schemaValidations/book.schema";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { FilePenLine, Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/data-table/my-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import categoryApiRequests from "@/apiRequests/category";
import { CategoryType } from "@/schemaValidations/category.schema";
import { CheckedState } from "@radix-ui/react-checkbox";
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";
import DeleteButton from "@/app/dashboard/book/_component/delete-button";
import DeleteArrayButton from "@/app/dashboard/book/_component/deleteArray-button";

export function BookTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [bookPaginated, setBooksPaginated] = useState<
    BookPaginatedResType | undefined
  >(undefined);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const fetchBooks = useCallback(
    async ({ triggerLoading }: { triggerLoading: boolean }) => {
      try {
        setAllChecked(false);
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

  useEffect(() => {
    if (allChecked !== "indeterminate") {
      const newCheckedItems: { [key: string]: boolean } = {};
      bookPaginated?.items.forEach((book) => {
        newCheckedItems[book.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, bookPaginated]);

  const handleAllCheckedChange = () => {
    setAllChecked((allChecked) => (allChecked === true ? false : true));
  };

  const handleItemCheckedChange = (id: string) => {
    const newCheckedItems = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };
    setCheckedItems(newCheckedItems);

    // Count checked items to determine the state of the "all" checkbox
    const checkedCount = Object.values(newCheckedItems).filter(Boolean).length;
    if (checkedCount === 0) setAllChecked(false);
    else if (checkedCount === bookPaginated?.items.length) setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  function handleDeleteCallback(): void {
    fetchBooks({ triggerLoading: false });
  }

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

        <div className="flex flex-row">
          <DeleteArrayButton
            checkedItems={checkedItems}
            callback={handleDeleteCallback}
          />

          <Link href="/dashboard/book/create">
            <Button variant="default" size="sm">
              <Plus />
              Thêm sách mới
            </Button>
          </Link>
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
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow className="bg-primary-foreground">
              <TableHead className="text-center border-s border-y">
                <Checkbox
                  id="all"
                  checked={allChecked}
                  onClick={handleAllCheckedChange}
                />
              </TableHead>
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
              <SortableTableHead
                orderName="CreatedOn"
                className="text-center border"
              >
                Thời gian tạo
              </SortableTableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookPaginated?.items.map((book: BookType, index) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Checkbox
                    id={book.id}
                    checked={checkedItems[book.id]}
                    onClick={() => handleItemCheckedChange(book.id)}
                  />
                </TableCell>
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
                <TableCell>{formatDate(book.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <Link href={`/dashboard/book/edit/${book.id}`}>
                      <Button variant="ghost" size="icon">
                        <FilePenLine size={20} className="text-blue-500" />
                      </Button>
                    </Link>

                    <DeleteButton
                      id={book.id}
                      callback={handleDeleteCallback}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      )}

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={bookPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

"use client";

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";
import { BookshelfType } from "@/schemaValidations/bookshelf.schema";
import { Badge } from "@/components/ui/badge";
import CreateBookshelfButton from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/create-bookshelf-button";
import UpdateBookshelfButton from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/update-bookshelf-button";
import DeleteBookshelfButton from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/delete-bookshelf-button";
import DeleteBookshelvesButton from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/delete-bookshelves-button";
import { formatDate } from "@/lib/utils";

export default function BookshelfTable({
  loading,
  bookshelves,
  callback,
}: {
  loading: boolean;
  bookshelves: BookshelfType[];
  callback: () => void;
}) {
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    setAllChecked(false);
  }, [bookshelves]);

  useEffect(() => {
    if (allChecked !== "indeterminate") {
      const newCheckedItems: { [key: string]: boolean } = {};
      bookshelves?.forEach((category) => {
        newCheckedItems[category.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, bookshelves]);

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
    else if (checkedCount === bookshelves.length) setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div></div>
        <div className="flex flex-row">
          <DeleteBookshelvesButton
            checkedItems={checkedItems}
            callback={callback}
          />

          <CreateBookshelfButton callback={callback} />
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
              <TableHead className="text-center border">Tên ngăn</TableHead>
              <TableHead className="text-center border">Số sách</TableHead>
              <TableHead className="text-center border">Tủ chứa</TableHead>
              <TableHead className="text-center border">
                Thời gian tạo
              </TableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookshelves?.map((bookshelf: BookshelfType, index) => (
              <TableRow key={bookshelf.id}>
                <TableCell>
                  <Checkbox
                    id={bookshelf.id}
                    checked={checkedItems[bookshelf.id]}
                    onClick={() => handleItemCheckedChange(bookshelf.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="font-medium">{bookshelf.name}</TableCell>
                <TableCell className="font-medium">
                  {bookshelf.booksCount}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {bookshelf.cabinetName}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(bookshelf.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <UpdateBookshelfButton
                      id={bookshelf.id}
                      callback={callback}
                    />

                    <DeleteBookshelfButton
                      id={bookshelf.id}
                      callback={callback}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

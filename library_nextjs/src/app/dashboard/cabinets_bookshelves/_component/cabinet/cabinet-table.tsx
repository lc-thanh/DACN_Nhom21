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
import { CabinetType } from "@/schemaValidations/cabinet.schema";
import CreateCabinetButton from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/create-cabinet-button";
import UpdateCabinetButton from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/update-cabinet-button";
import DeleteCabinetButton from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/delete-cabinet-button";
import DeleteCabinetsButton from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/delete-cabinets-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function CabinetTable({
  loading,
  cabinets,
  callback,
}: {
  loading: boolean;
  cabinets: CabinetType[];
  callback: () => void;
}) {
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    setAllChecked(false);
  }, [cabinets]);

  useEffect(() => {
    if (allChecked !== "indeterminate") {
      const newCheckedItems: { [key: string]: boolean } = {};
      cabinets?.forEach((category) => {
        newCheckedItems[category.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, cabinets]);

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
    else if (checkedCount === cabinets.length) setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div></div>
        <div className="flex flex-row">
          <DeleteCabinetsButton
            checkedItems={checkedItems}
            callback={callback}
          />

          <CreateCabinetButton callback={callback} />
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
              <TableHead className="text-center border">Tên tủ</TableHead>
              <TableHead className="text-center border">Vị trí</TableHead>
              <TableHead className="text-center border">
                Chứa ngăn sách
              </TableHead>
              <TableHead className="text-center border">
                Thời gian tạo
              </TableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cabinets?.map((cabinet: CabinetType, index) => (
              <TableRow key={cabinet.id}>
                <TableCell>
                  <Checkbox
                    id={cabinet.id}
                    checked={checkedItems[cabinet.id]}
                    onClick={() => handleItemCheckedChange(cabinet.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="font-medium min-w-[150px]">
                  {cabinet.name}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  {cabinet.location}
                </TableCell>
                <TableCell className="min-w-[150px]">
                  <div className="flex flex-row space-x-1 justify-center">
                    {cabinet.bookShelfNames.map((name) => (
                      <Badge
                        key={name}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{formatDate(cabinet.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <UpdateCabinetButton id={cabinet.id} callback={callback} />

                    <DeleteCabinetButton id={cabinet.id} callback={callback} />
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

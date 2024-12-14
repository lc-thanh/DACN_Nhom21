"use client";

import categoryApiRequests from "@/apiRequests/category";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
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
import { handleApiError } from "@/lib/utils";
import { CategoryType } from "@/schemaValidations/category.schema";
import { CheckedState } from "@radix-ui/react-checkbox";
import { FilePenLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import CreateCategoryButton from "@/app/dashboard/category/_component/create-category-button";

export default function CategoryTable() {
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { payload } = await categoryApiRequests.getCategories();
      setCategories(payload);
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra trong quá trình tải dữ liệu danh mục!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (allChecked !== "indeterminate") {
      const newCheckedItems: { [key: string]: boolean } = {};
      categories?.forEach((category) => {
        newCheckedItems[category.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, categories]);

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
    else if (checkedCount === categories.length) setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm - dd/MM/yyyy");
  };

  const handleRefreshCallback = () => {
    fetchCategories();
  };

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div></div>
        <div className="flex flex-row space-x-2">
          {/* <DeleteArrayButton
            checkedItems={checkedItems}
            callback={handleDeleteCallback}
          /> */}
          <CreateCategoryButton callback={handleRefreshCallback} />
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
              <TableHead className="text-center border">Tên danh mục</TableHead>
              <TableHead className="text-center border">
                Số lượng sách
              </TableHead>
              <TableHead className="text-center border">Mô tả</TableHead>
              <TableHead className="text-center border">
                Thời gian tạo
              </TableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: CategoryType, index) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    id={category.id}
                    checked={checkedItems[category.id]}
                    onClick={() => handleItemCheckedChange(category.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.booksCount}</TableCell>
                <TableCell className="min-w-[150px]">
                  {category.description}
                </TableCell>
                <TableCell>{formatDate(category.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <Link href={`/dashboard/category/edit/${category.id}`}>
                      <Button variant="ghost" size="icon">
                        <FilePenLine size={20} className="text-blue-500" />
                      </Button>
                    </Link>

                    <Button variant="ghost" size="icon">
                      <Trash2 size={20} className="text-red-500" />
                    </Button>
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

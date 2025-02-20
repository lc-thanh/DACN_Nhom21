"use client";

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
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/data-table/my-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { CheckedState } from "@radix-ui/react-checkbox";
import TableSearch from "@/components/data-table/table-search";
import DeleteArrayButton from "@/app/dashboard/book/_component/deleteArray-button";
import {
  LoanPaginatedResType,
  LoanType,
} from "@/schemaValidations/loan.schema";
import loanApiRequests from "@/apiRequests/loan";
import LoanRowActions from "@/app/dashboard/loan/_component/loan-row-actions";
import ReturnBookDialog from "@/app/dashboard/loan/_component/return-book-dialog";
import ApproveLoanDialog from "@/app/dashboard/loan/_component/approve-loan-dialog";
import OnLoanDialog from "@/app/dashboard/loan/_component/on-loan-dialog";
import DeleteLoanDialog from "@/app/dashboard/loan/_component/delete-loan-dialog";
import LoanAlert from "@/app/dashboard/loan/_component/loan-alert";
import UnreturnedLoanDialog from "@/app/dashboard/loan/_component/unreturned-loan-dialog";

export function LoanTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loanPaginated, setLoanPaginated] = useState<
    LoanPaginatedResType | undefined
  >(undefined);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openOnLoanDialog, setOpenOnLoanDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUnreturnedDialog, setOpenUnreturnedDialog] = useState(false);
  const [actionId, setActionId] = useState<string>("");

  const fetchBooks = useCallback(
    async ({ triggerLoading }: { triggerLoading: boolean }) => {
      try {
        setAllChecked(false);
        const params = new URLSearchParams(searchParams);
        if (triggerLoading) setLoading(true);
        const { payload } = await loanApiRequests.getLoans(params.toString());
        if (payload?.items.length === 0) {
          toast.info("Không có dữ liệu để hiển thị!");
        }
        console.log(payload);

        setLoanPaginated(payload);
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Có lỗi xảy ra trong quá trình tải dữ liệu!",
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
      loanPaginated?.items.forEach((book) => {
        newCheckedItems[book.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, loanPaginated]);

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
    else if (checkedCount === loanPaginated?.items.length) setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  function handleDeleteCallback(): void {
    fetchBooks({ triggerLoading: false });
  }

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm..." />

          <TableFacetedFilter
            title="Trạng thái phiếu"
            filterName="statusFilter"
            options={[
              { label: "Chờ tiếp nhận", value: "Pending", color: "yellow" },
              { label: "Đã tiếp nhận", value: "Approved", color: "green" },
              { label: "Đang mượn", value: "OnLoan", color: "blue" },
              { label: "Đã trả", value: "Returned" },
              { label: "Quá hạn", value: "Overdue", color: "red" },
              { label: "Đã vô hiệu", value: "Unreturned" },
            ]}
          />
        </div>

        <div className="flex flex-row">
          <DeleteArrayButton
            checkedItems={checkedItems}
            callback={handleDeleteCallback}
          />

          <Link href="/dashboard/loan/create">
            <Button variant="default" size="sm">
              <Plus />
              Thêm phiếu mới
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
              <TableHead className="text-center border">Mã phiếu</TableHead>
              <TableHead className="text-center border">Trạng thái</TableHead>
              <TableHead className="text-center border">Người mượn</TableHead>
              <TableHead className="text-center border">
                Số điện thoại
              </TableHead>
              <TableHead className="text-center border">Ngày mượn</TableHead>
              <TableHead className="text-center border">Hạn trả</TableHead>
              <TableHead className="text-center border">Ngày trả</TableHead>
              <TableHead className="text-center border">Sách</TableHead>
              <TableHead className="text-center border">Tiền cọc</TableHead>
              <TableHead className="text-center border">Nhân viên</TableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loanPaginated?.items.map((loan: LoanType, index) => (
              <TableRow key={loan.id}>
                <TableCell>
                  <Checkbox
                    id={loan.id}
                    checked={checkedItems[loan.id]}
                    onClick={() => handleItemCheckedChange(loan.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="min-w-[100px] font-medium">
                  <div className="flex flex-row justify-center items-center gap-2">
                    {loan.warning && <LoanAlert loanWarning={loan.warning} />}
                    {loan.loanCode}
                  </div>
                </TableCell>
                <TableCell className="min-w-[100px]">
                  {loan.status === "Pending" ? (
                    <span className="text-yellow-500">Chờ tiếp nhận</span>
                  ) : loan.status === "Approved" ? (
                    <span className="text-green-500">Đã tiếp nhận</span>
                  ) : loan.status === "OnLoan" ? (
                    <span className="text-blue-500">Đang mượn</span>
                  ) : loan.status === "Returned" ? (
                    <span>Đã trả</span>
                  ) : loan.status === "Overdue" ? (
                    <span className="text-red-500">Quá hạn</span>
                  ) : loan.status === "Unreturned" ? (
                    <span>Đã vô hiệu</span>
                  ) : null}
                </TableCell>
                <TableCell>{loan.memberFullName}</TableCell>
                <TableCell>{loan.memberPhone}</TableCell>
                <TableCell>{formatDate(loan.loanDate)}</TableCell>
                <TableCell>{formatDate(loan.dueDate)}</TableCell>
                <TableCell>{formatDate(loan.returnedDate)}</TableCell>
                <TableCell>{loan.bookNames.join(", ")}</TableCell>
                <TableCell className="text-nowrap">
                  {loan.deposit.toLocaleString("de-DE") + " đ"}
                </TableCell>
                <TableCell>{loan.librarianFullName}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <LoanRowActions
                      id={loan.id}
                      status={loan.status}
                      setActionId={setActionId}
                      setOpenReturnDialog={setOpenReturnDialog}
                      setOpenApproveDialog={setOpenApproveDialog}
                      setOpenOnLoanDialog={setOpenOnLoanDialog}
                      setOpenDeleteDialog={setOpenDeleteDialog}
                      setOpenUnreturnedDialog={setOpenUnreturnedDialog}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ReturnBookDialog
        id={actionId}
        loanCode={
          loanPaginated?.items.find((item) => item.id === actionId)?.loanCode ??
          ""
        }
        callback={handleDeleteCallback}
        open={openReturnDialog}
        setOpen={setOpenReturnDialog}
      />

      <ApproveLoanDialog
        id={actionId}
        loanCode={
          loanPaginated?.items.find((item) => item.id === actionId)?.loanCode ??
          ""
        }
        callback={handleDeleteCallback}
        open={openApproveDialog}
        setOpen={setOpenApproveDialog}
      />

      <OnLoanDialog
        id={actionId}
        loanCode={
          loanPaginated?.items.find((item) => item.id === actionId)?.loanCode ??
          ""
        }
        callback={handleDeleteCallback}
        open={openOnLoanDialog}
        setOpen={setOpenOnLoanDialog}
      />

      <DeleteLoanDialog
        id={actionId}
        loanCode={
          loanPaginated?.items.find((item) => item.id === actionId)?.loanCode ??
          ""
        }
        callback={handleDeleteCallback}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />

      <UnreturnedLoanDialog
        id={actionId}
        loanCode={
          loanPaginated?.items.find((item) => item.id === actionId)?.loanCode ??
          ""
        }
        callback={handleDeleteCallback}
        open={openUnreturnedDialog}
        setOpen={setOpenUnreturnedDialog}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={loanPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

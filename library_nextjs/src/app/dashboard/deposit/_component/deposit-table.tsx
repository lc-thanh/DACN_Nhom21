"use client";

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
import Pagination from "@/components/data-table/my-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import TableSearch from "@/components/data-table/table-search";
import { depositApiRequests } from "@/apiRequests/deposit";
import {
  DepositTransactionPaginatedResType,
  DepositTransactionType,
} from "@/schemaValidations/transaction.schema";
import WithdrawInButton from "@/app/dashboard/deposit/_component/withdraw-in-button";
import WithdrawOutButton from "@/app/dashboard/deposit/_component/withdraw-out-button";

export function DepositTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [depositPaginated, setDepositPaginated] = useState<
    DepositTransactionPaginatedResType | undefined
  >(undefined);

  const fetchBooks = useCallback(
    async ({ triggerLoading }: { triggerLoading: boolean }) => {
      try {
        const params = new URLSearchParams(searchParams);
        if (triggerLoading) setLoading(true);
        const { payload } = await depositApiRequests.get(params.toString());
        if (payload?.items.length === 0) {
          toast.info("Không có dữ liệu để hiển thị!");
        }

        console.log(payload);

        setDepositPaginated(payload);
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

  function handleRefreshCallback(): void {
    fetchBooks({ triggerLoading: false });
  }

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm..." />

          <TableFacetedFilter
            title="Loại giao dịch"
            filterName="typeFilter"
            options={[
              { label: "Cọc phiếu", value: "DepositIn", color: "blue" },
              { label: "Hoàn cọc", value: "DepositOut", color: "green" },
              { label: "Thêm vào", value: "WithdrawIn", color: "yellow" },
              { label: "Rút ra", value: "WithdrawOut", color: "red" },
            ]}
          />
        </div>

        <div className="flex flex-row space-x-2">
          <WithdrawInButton callback={handleRefreshCallback} />
          <WithdrawOutButton callback={handleRefreshCallback} />
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
              <TableHead className="text-center border-y">#</TableHead>
              <TableHead className="text-center border">
                Loại giao dịch
              </TableHead>
              <TableHead className="text-center border">Số tiền</TableHead>
              <TableHead className="text-center border">Nhân viên</TableHead>
              <TableHead className="text-center border">Chi tiết</TableHead>
              <TableHead className="text-center border">Thời gian</TableHead>
              <TableHead className="text-center border">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {depositPaginated?.items.map(
              (deposit: DepositTransactionType, index) => (
                <TableRow key={deposit.id}>
                  <TableCell>{`${index + 1}.`}</TableCell>
                  <TableCell className="min-w-[100px]">
                    {deposit.transactionType === "DepositIn" ? (
                      <span className="text-blue-500">Cọc phiếu</span>
                    ) : deposit.transactionType === "DepositOut" ? (
                      <span className="text-green-500">Hoàn cọc</span>
                    ) : deposit.transactionType === "WithdrawIn" ? (
                      <span className="text-yellow-500">Thêm vào</span>
                    ) : deposit.transactionType === "WithdrawOut" ? (
                      <span className="text-red-500">Rút ra</span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {deposit.amount.toLocaleString("de-DE") + " đ"}
                  </TableCell>
                  <TableCell>{deposit.librarianFullName}</TableCell>
                  <TableCell>
                    {deposit.transactionType === "DepositIn"
                      ? `${deposit.memberFullName} đã cọc phiếu ${deposit.description}`
                      : deposit.transactionType === "DepositOut"
                      ? `${deposit.memberFullName} đã lấy lại cọc phiếu ${deposit.description}`
                      : deposit.description}
                  </TableCell>
                  <TableCell>{formatDate(deposit.timestamp)}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={depositPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

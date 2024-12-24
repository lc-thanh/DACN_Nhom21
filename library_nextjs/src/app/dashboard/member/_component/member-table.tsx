"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate, handleApiError } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, LockOpen } from "lucide-react";
import Pagination from "@/components/data-table/my-pagination";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { CheckedState } from "@radix-ui/react-checkbox";
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";
import {
  MemberPaginatedResType,
  MemberStatus,
  MemberType,
} from "@/schemaValidations/member.schema";
import memberApiRequests from "@/apiRequests/member";
import CreateMemberButton from "@/app/dashboard/member/_component/create-member-button";
import TableRowActions from "@/app/dashboard/member/_component/table-row-actions";
import UpdateMemberDrawer from "@/app/dashboard/member/_component/update-member-drawer";
import DeleteMemberDialog from "@/app/dashboard/member/_component/delete-member-dialog";
import DeleteMembersButton from "@/app/dashboard/member/_component/delete-members-button";
import ResetPasswordDialog from "@/components/reset-password-dialog";
import LockUserDialog from "@/components/lock-user-dialog";
import UnlockUserDialog from "@/components/unlock-user-dialog";

export function MemberTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [memberPaginated, setMemberPaginated] = useState<
    MemberPaginatedResType | undefined
  >(undefined);
  const [openUpdateDrawer, setOpenUpdateDrawer] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [openLockDialog, setOpenLockDialog] = useState(false);
  const [openUnlockDialog, setOpenUnlockDialog] = useState(false);
  const [actionId, setActionId] = useState<string>("");

  const fetchBooks = useCallback(
    async ({ triggerLoading }: { triggerLoading: boolean }) => {
      try {
        setAllChecked(false);
        const params = new URLSearchParams(searchParams);
        if (triggerLoading) setLoading(true);

        const { payload: paginatedMembers } =
          await memberApiRequests.getMembers(params.toString());

        if (paginatedMembers.items.length === 0) {
          toast.info("Không có dữ liệu để hiển thị!");
        }
        setMemberPaginated(paginatedMembers);
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Tải dữ liệu thành viên thất bại!",
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
      memberPaginated?.items.forEach((book) => {
        newCheckedItems[book.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, memberPaginated]);

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
    else if (checkedCount === memberPaginated?.items.length)
      setAllChecked(true);
    else setAllChecked("indeterminate");
  };

  function handleRefreshCallback(): void {
    fetchBooks({ triggerLoading: false });
  }

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm..." />

          <TableFacetedFilter
            title="Trạng thái"
            filterName="statusFilter"
            options={[
              { value: "Normal", label: "Bình thường" },
              { value: "OnLoan", label: "Đang mượn", color: "blue" },
              { value: "Overdue", label: "Quá hạn", color: "red" },
            ]}
          />
        </div>

        <div className="flex flex-row">
          <DeleteMembersButton
            checkedItems={checkedItems}
            callback={handleRefreshCallback}
          />

          <CreateMemberButton callback={handleRefreshCallback} />
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
                orderName="FullName"
                className="text-center border"
              >
                Họ tên
              </SortableTableHead>
              <TableHead className="text-center border">Mã GV/SV</TableHead>
              <TableHead className="text-center border">
                Số điện thoại
              </TableHead>
              <TableHead className="text-center border">Email</TableHead>
              <TableHead className="text-center border">Địa chỉ</TableHead>
              <SortableTableHead
                orderName="LoansCount"
                className="text-center border"
              >
                Số phiếu mượn
              </SortableTableHead>
              <TableHead className="text-center border">Bị khóa</TableHead>
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
            {memberPaginated?.items.map((member: MemberType, index) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Checkbox
                    id={member.id}
                    checked={checkedItems[member.id]}
                    onClick={() => handleItemCheckedChange(member.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell
                  className={cn(
                    "min-w-[150px] font-medium",
                    member.status === MemberStatus.Enum.OnLoan &&
                      "text-blue-500",
                    member.status === MemberStatus.Enum.Overdue &&
                      "text-red-500"
                  )}
                >
                  {member.fullName}
                </TableCell>
                <TableCell className="min-w-[100px]">
                  {member.individualId}
                </TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>{member.loansCount}</TableCell>
                <TableCell>
                  <div className="flex justify-center h-full">
                    {member.isLocked ? (
                      <Lock className="size-4 text-red-500" />
                    ) : (
                      <LockOpen className="size-4 text-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(member.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <TableRowActions
                      id={member.id}
                      fullName={member.fullName}
                      islocked={member.isLocked}
                      callback={handleRefreshCallback}
                      setActionId={setActionId}
                      setOpenUpdateDrawer={setOpenUpdateDrawer}
                      setOpenDeleteDialog={setOpenDeleteDialog}
                      setOpenResetPasswordDialog={setOpenResetPasswordDialog}
                      setOpenLockDialog={setOpenLockDialog}
                      setOpenUnlockDialog={setOpenUnlockDialog}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <UpdateMemberDrawer
        id={actionId}
        callback={handleRefreshCallback}
        open={openUpdateDrawer}
        setOpen={setOpenUpdateDrawer}
      />

      <DeleteMemberDialog
        id={actionId}
        callback={handleRefreshCallback}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />

      <ResetPasswordDialog
        id={actionId}
        fullName={
          memberPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openResetPasswordDialog}
        setOpen={setOpenResetPasswordDialog}
      />

      <LockUserDialog
        id={actionId}
        fullName={
          memberPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openLockDialog}
        setOpen={setOpenLockDialog}
      />

      <UnlockUserDialog
        id={actionId}
        fullName={
          memberPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openUnlockDialog}
        setOpen={setOpenUnlockDialog}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={memberPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

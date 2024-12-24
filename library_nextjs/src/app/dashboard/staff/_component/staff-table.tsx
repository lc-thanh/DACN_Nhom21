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
import { formatDate, handleApiError } from "@/lib/utils";
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
import staffApiRequests from "@/apiRequests/staff";
import {
  StaffPaginatedResType,
  StaffType,
} from "@/schemaValidations/staff.schema";
import { Badge } from "@/components/ui/badge";
import CreateStaffButton from "@/app/dashboard/staff/_component/create-staff-button";
import StaffTableRowActions from "@/app/dashboard/staff/_component/table-row-actions";
import UpdateStaffDrawer from "@/app/dashboard/staff/_component/update-staff-drawer";
import ResetPasswordDialog from "@/components/reset-password-dialog";
import LockUserDialog from "@/components/lock-user-dialog";
import UnlockUserDialog from "@/components/unlock-user-dialog";
import DeleteStaffDialog from "@/app/dashboard/staff/_component/delete-staff-dialog";
import DeleteStaffsButton from "@/app/dashboard/staff/_component/delete-staffs-button";

export function StaffTable() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [allChecked, setAllChecked] = useState<CheckedState>(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [staffPaginated, setStaffPaginated] = useState<
    StaffPaginatedResType | undefined
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

        const { payload: paginatedMembers } = await staffApiRequests.getStaffs(
          params.toString()
        );

        if (paginatedMembers.items.length === 0) {
          toast.info("Không có dữ liệu để hiển thị!");
        }
        setStaffPaginated(paginatedMembers);
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Tải dữ liệu thất bại!",
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
      staffPaginated?.items.forEach((book) => {
        newCheckedItems[book.id] = allChecked === true;
      });
      setCheckedItems(newCheckedItems);
    }
  }, [allChecked, staffPaginated]);

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
    else if (checkedCount === staffPaginated?.items.length) setAllChecked(true);
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
            title="Vai trò"
            filterName="roleFilter"
            options={[
              { value: "Librarian", label: "Thủ thư" },
              { value: "Admin", label: "Quản trị", color: "red" },
            ]}
          />
        </div>

        <div className="flex flex-row">
          <DeleteStaffsButton
            checkedItems={checkedItems}
            callback={handleRefreshCallback}
          />

          <CreateStaffButton callback={handleRefreshCallback} />
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
              <TableHead className="text-center border">Vai trò</TableHead>
              <SortableTableHead
                orderName="FullName"
                className="text-center border"
              >
                Họ tên
              </SortableTableHead>
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
            {staffPaginated?.items.map((staff: StaffType, index) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <Checkbox
                    id={staff.id}
                    checked={checkedItems[staff.id]}
                    onClick={() => handleItemCheckedChange(staff.id)}
                  />
                </TableCell>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell>
                  {staff.role === "Admin" ? (
                    <Badge variant="destructive">Quản trị</Badge>
                  ) : (
                    <Badge className="text-white bg-blue-500 hover:bg-blue-600">
                      Thủ thư
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="min-w-[150px] font-medium">
                  {staff.fullName}
                </TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.address}</TableCell>
                <TableCell>{staff.loansCount}</TableCell>
                <TableCell>
                  <div className="flex justify-center h-full">
                    {staff.isLocked ? (
                      <Lock className="size-4 text-red-500" />
                    ) : (
                      <LockOpen className="size-4 text-green-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(staff.createdOn)}</TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <StaffTableRowActions
                      id={staff.id}
                      fullName={staff.fullName}
                      islocked={staff.isLocked}
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

      <UpdateStaffDrawer
        id={actionId}
        callback={handleRefreshCallback}
        open={openUpdateDrawer}
        setOpen={setOpenUpdateDrawer}
      />

      <DeleteStaffDialog
        id={actionId}
        callback={handleRefreshCallback}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />

      <ResetPasswordDialog
        id={actionId}
        fullName={
          staffPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openResetPasswordDialog}
        setOpen={setOpenResetPasswordDialog}
      />

      <LockUserDialog
        id={actionId}
        fullName={
          staffPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openLockDialog}
        setOpen={setOpenLockDialog}
      />

      <UnlockUserDialog
        id={actionId}
        fullName={
          staffPaginated?.items.find((member) => member.id === actionId)
            ?.fullName ?? ""
        }
        callback={handleRefreshCallback}
        open={openUnlockDialog}
        setOpen={setOpenUnlockDialog}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={staffPaginated?.totalPages ?? 0} />
      </div>
    </>
  );
}

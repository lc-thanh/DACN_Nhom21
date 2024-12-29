"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AllBooksTable } from "@/app/dashboard/loan/_component/all-books-table";
import { LoanBookType } from "@/schemaValidations/book.schema";
import CreateMemberLoanForm from "@/app/member/loan/_component/create-member-loan-form";

export default function CreateMemberLoanCards() {
  const [pickedBooks, setPickedBooks] = React.useState<LoanBookType[]>([]);

  return (
    <>
      <h1 className="scroll-m-20 ms-2 mt-4 mb-4 text-2xl font-semibold tracking-tight">
        Bảng chọn sách
      </h1>
      <Card className="">
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>Tất cả sách trong thư viện</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <AllBooksTable
            pickedBooks={pickedBooks}
            setPickedBooks={setPickedBooks}
          />
        </CardContent>
      </Card>

      <h1 className="scroll-m-20 ms-2 mt-10 mb-4 text-2xl font-semibold tracking-tight">
        Thông tin phiếu mượn
      </h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Biểu mẫu</CardTitle>
          <CardDescription>Điền thông tin phiếu mượn</CardDescription>
          <CardDescription>
            <span className="text-red-500">Lưu ý!</span> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <CreateMemberLoanForm
            pickedBooks={pickedBooks}
            setPickedBooks={setPickedBooks}
          />
        </CardContent>
      </Card>
    </>
  );
}

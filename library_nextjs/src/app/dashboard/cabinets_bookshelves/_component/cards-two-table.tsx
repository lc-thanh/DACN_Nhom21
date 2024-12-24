"use client";

import bookshelfApiRequests from "@/apiRequests/bookshelf";
import cabinetApiRequests from "@/apiRequests/cabinet";
import BookshelfTable from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/bookshelf-table";
import CabinetTable from "@/app/dashboard/cabinets_bookshelves/_component/cabinet/cabinet-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleApiError } from "@/lib/utils";
import { BookshelfType } from "@/schemaValidations/bookshelf.schema";
import { CabinetType } from "@/schemaValidations/cabinet.schema";
import { useEffect, useState } from "react";

export default function CardsTwoTable() {
  const [loading, setLoading] = useState(false);
  const [cabinets, setCabinets] = useState<CabinetType[]>([]);
  const [bookshelves, setBookshelves] = useState<BookshelfType[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ payload: cabinetData }, { payload: bookshelfData }] =
        await Promise.all([
          cabinetApiRequests.getCabinets(),
          bookshelfApiRequests.getBookshelves(),
        ]);
      setCabinets(cabinetData);
      setBookshelves(bookshelfData);
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Tải dữ liệu thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefreshCallback = () => {
    fetchData();
  };

  return (
    <>
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Quản lý tủ</CardTitle>
          <CardDescription>Danh sách tất cả tủ trong thư viện</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <CabinetTable
            loading={loading}
            cabinets={cabinets}
            callback={handleRefreshCallback}
          />
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quản lý ngăn sách</CardTitle>
          <CardDescription>
            Danh sách tất cả ngăn sách trong thư viện
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <BookshelfTable
            loading={loading}
            bookshelves={bookshelves}
            callback={handleRefreshCallback}
          />
        </CardContent>
      </Card>
    </>
  );
}

"use client";

import { TableHead } from "@/components/ui/table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortableTableHead({
  children,
  className,
  orderName,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  orderName: string;
}>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const orderByString = searchParams.get("orderBy")?.toString();
  const name = orderByString?.split("-")[0];
  const orderBy = orderByString?.split("-")[1];

  // Nếu hiện tại đang order bằng cột khác thì sẽ order theo cột này với chiều giảm dần
  // Còn nếu đang order theo cột này với chiều giảm dần thì đổi chiều
  // Còn nếu đang order theo cột này với chiều tăng dần thì xóa orderBy
  const orderInNextClick =
    name !== orderName
      ? `${orderName}-Desc`
      : orderBy === "Desc"
      ? `${orderName}-Asc`
      : "";

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    if (orderInNextClick === "") params.delete("orderBy");
    else params.set("orderBy", orderInNextClick);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TableHead className={className}>
      <a
        className="flex flex-row cursor-pointer items-center h-full justify-around"
        onClick={handleClick}
      >
        {children}
        {name === orderName ? (
          orderBy === "Asc" ? (
            <ChevronUp size={18} className="text-blue-500" />
          ) : (
            <ChevronDown size={18} className="text-blue-500" />
          )
        ) : (
          <ChevronsUpDown size={18} />
        )}
      </a>
    </TableHead>
  );
}

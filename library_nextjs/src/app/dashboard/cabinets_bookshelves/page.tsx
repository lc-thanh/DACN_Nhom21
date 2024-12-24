import { BreadcrumbCabinet } from "@/app/dashboard/cabinets_bookshelves/_component/breadcrumb-cabinet";
import CardsTwoTable from "@/app/dashboard/cabinets_bookshelves/_component/cards-two-table";

export default function CabinetsPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbCabinet />
      </div>
      <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
        Quản lý tủ/ngăn sách
      </h1>
      <CardsTwoTable />
    </div>
  );
}

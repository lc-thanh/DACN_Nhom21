import { BreadcrumbCreateLoan } from "@/app/dashboard/loan/_component/breadcrumb-create-loan";
import CreateLoanCards from "@/app/dashboard/loan/_component/create-loan-cards";

export default function CreateLoanPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbCreateLoan />
      </div>

      <CreateLoanCards />
    </div>
  );
}

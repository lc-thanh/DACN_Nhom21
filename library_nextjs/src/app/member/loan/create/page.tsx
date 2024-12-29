import { BreadcrumbCreateMemberLoan } from "@/app/member/loan/_component/breadcrumb-create-loan";
import CreateMemberLoanCards from "@/app/member/loan/_component/create-member-loan-cards";

export default function CreateMemberLoanPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <div className="my-2 ms-2">
        <BreadcrumbCreateMemberLoan />
      </div>

      <CreateMemberLoanCards />
    </div>
  );
}

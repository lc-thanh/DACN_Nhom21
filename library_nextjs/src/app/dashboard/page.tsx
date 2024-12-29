import { LoanAreaChart } from "@/app/dashboard/_component/loan-area-chart";
import { LoanAnimatedNumberGrid } from "@/app/dashboard/_component/loan-number-grid";
import { LoanPieChart } from "@/app/dashboard/_component/loan-pie-chart";
import { AnimatedNumberSkeleton } from "@/app/dashboard/_component/skeleton-loan-number-card";
import UserActionsCard from "@/app/dashboard/_component/user-actions-card";
import UserActionsTable from "@/app/dashboard/_component/user-actions-table";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <h1 className="scroll-m-20 ms-2 pb-4 mt-4 text-2xl font-semibold tracking-tight">
        Tổng quát
      </h1>
      <Suspense
        fallback={
          <div className="w-full mx-auto mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <AnimatedNumberSkeleton />
              <AnimatedNumberSkeleton />
              <AnimatedNumberSkeleton />
              <AnimatedNumberSkeleton />
            </div>
          </div>
        }
      >
        <LoanAnimatedNumberGrid />
      </Suspense>
      <div className="flex lg:flex-row flex-col gap-4 justify-center">
        <div className="w-full lg:max-w-[65%]">
          <LoanAreaChart />
        </div>
        <div className="w-full lg:max-w-[35%] h-full">
          <LoanPieChart />
        </div>
      </div>

      <UserActionsCard />
    </div>
  );
}

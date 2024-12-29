import statisticApiRequests from "@/apiRequests/statistic";
import { AnimatedNumberCard } from "@/components/animated-number-card";

// const cardData = [
//   { label: "Tổng số phiếu", number: 156 },
//   { label: "Số phiếu đang chờ", number: 12 },
//   { label: "Số phiếu đã tiếp nhận", number: 27 },
//   { label: "Số phiếu quá hạn", number: 15 },
// ];

export async function LoanAnimatedNumberGrid() {
  const { payload: statData } =
    await statisticApiRequests.getLoanCountByStatus();
  const cardData = [
    { label: "Tổng số phiếu", number: statData.totalLoans },
    { label: "Số phiếu đang chờ", number: statData.pendingLoans },
    { label: "Số phiếu đã tiếp nhận", number: statData.approvedLoans },
    { label: "Số phiếu quá hạn", number: statData.overDueLoans },
  ];

  return (
    <div className="w-full mx-auto mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <AnimatedNumberCard
            key={index}
            label={card.label}
            number={card.number}
          />
        ))}
      </div>
    </div>
  );
}

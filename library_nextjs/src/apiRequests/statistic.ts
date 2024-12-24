import http from "@/lib/http";
import { LoanCountByStatusType } from "@/schemaValidations/statistic.schema";

const statisticApiRequests = {
  getLoanCountByStatus: async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<LoanCountByStatusType>(`/Statistics/loan-count-by-status`);
  },
};

export default statisticApiRequests;

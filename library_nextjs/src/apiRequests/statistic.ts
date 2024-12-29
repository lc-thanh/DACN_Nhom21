import http from "@/lib/http";
import {
  LoanCountByStatusType,
  UserActionType,
} from "@/schemaValidations/statistic.schema";

const statisticApiRequests = {
  getLoanCountByStatus: async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<LoanCountByStatusType>(`/Statistics/loan-count-by-status`);
  },
  getUserActions: async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<UserActionType[]>(`/Statistics/user-actions`);
  },
};

export default statisticApiRequests;

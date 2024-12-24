import http from "@/lib/http";
import {
  CreateLoanBodyType,
  LoanPaginatedResType,
  LoanType,
} from "@/schemaValidations/loan.schema";

const loanApiRequests = {
  get: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<LoanType>(`/Loans/${id}`);
  },
  getLoans: async (params: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<LoanPaginatedResType>(`/Loans?${params}`);
  },
  create: async (body: CreateLoanBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    body.dueDate.setHours(23, 59, 59, 0);
    return http.post("/Loans", body);
  },
  returnBook: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Loans/${id}/return-book`, null);
  },
};
export default loanApiRequests;

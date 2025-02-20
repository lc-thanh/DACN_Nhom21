import http from "@/lib/http";
import {
  CreateLoanBodyType,
  LoanPaginatedResType,
  LoanType,
  MemberCreateLoanBodyType,
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
  memberGetLoans: async (params: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<LoanPaginatedResType>(`/Loans/member?${params}`);
  },
  create: async (body: CreateLoanBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    body.dueDate.setHours(23, 59, 59, 0);
    return http.post("/Loans", body);
  },
  memberCreateLoan: async (body: MemberCreateLoanBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    body.dueDate.setHours(23, 59, 59, 0);
    return http.post("/Loans/member", body);
  },
  returnBook: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Loans/${id}/return-book`, null);
  },
  approveLoan: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Loans/${id}/approve`, null);
  },
  approveToOnloan: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Loans/${id}/onloan`, null);
  },
  toUnreturned: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Loans/${id}/unreturned`, null);
  },
  delete: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Loans/${id}`, null);
  },
  memberDeleteLoan: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Loans/member/${id}`, null);
  },
};
export default loanApiRequests;

import http from "@/lib/http";
import {
  DepositTransactionPaginatedResType,
  TotalDepositInforsType,
  TransactionCreateBodyType,
} from "@/schemaValidations/transaction.schema";

export const depositApiRequests = {
  get: (params: string) => {
    return http.get<DepositTransactionPaginatedResType>(
      `/DepositTransactions?${params}`
    );
  },
  getDepositInfors: () => {
    return http.get<TotalDepositInforsType>(
      "/DepositTransactions/total-amount"
    );
  },
  withdrawIn: (values: TransactionCreateBodyType) => {
    return http.post("/DepositTransactions/withdraw-in", values);
  },
};

import { z } from "zod";

export const TransactionType = z.enum([
  "DepositIn",
  "DepositOut",
  "WithdrawIn",
  "WithdrawOut",
]);

export const TotalDepositInfors = z
  .object({
    totalFund: z.number().positive(),
    totalCount: z.number().positive(),
  })
  .strict();
export type TotalDepositInforsType = z.TypeOf<typeof TotalDepositInfors>;

export const DepositTransaction = z
  .object({
    id: z.string().uuid(),
    amount: z.number().positive(),
    transactionType: TransactionType,
    description: z.string(),
    memberId: z.string().uuid(),
    memberFullName: z.string(),
    librarianId: z.string().uuid(),
    librarianFullName: z.string(),
    timestamp: z.string(),
  })
  .strict();
export type DepositTransactionType = z.TypeOf<typeof DepositTransaction>;

export const DepositTransactionPaginatedRes = z
  .object({
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
    items: z.array(DepositTransaction),
  })
  .strict();
export type DepositTransactionPaginatedResType = z.TypeOf<
  typeof DepositTransactionPaginatedRes
>;

export const TransactionCreateBody = z.object({
  amount: z.number().positive(),
  description: z.string(),
});
export type TransactionCreateBodyType = z.TypeOf<typeof TransactionCreateBody>;

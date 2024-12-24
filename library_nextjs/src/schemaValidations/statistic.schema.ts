import { z } from "zod";

export const LoanCountByStatus = z
  .object({
    totalLoans: z.number(),
    pendingLoans: z.number(),
    approvedLoans: z.number(),
    onLoansCount: z.number(),
    overDueLoans: z.number(),
  })
  .strict();
export type LoanCountByStatusType = z.TypeOf<typeof LoanCountByStatus>;

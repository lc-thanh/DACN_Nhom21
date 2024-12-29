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

export const UserAction = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string(),
  actionName: z.string(),
  timestamp: z.string(),
});
export type UserActionType = z.TypeOf<typeof UserAction>;

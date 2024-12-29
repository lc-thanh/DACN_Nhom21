import { phoneFormatTest } from "@/lib/utils";
import { z } from "zod";

export const LoanStatus = z.enum([
  "Pending",
  "Approved",
  "OnLoan",
  "Returned",
  "Overdue",
]);

export const Loan = z
  .object({
    id: z.string().uuid(),
    loanCode: z.string().length(8),
    loanDate: z.string(),
    dueDate: z.string(),
    returnedDate: z.string().optional(),
    deposit: z.number(),
    status: LoanStatus,
    memberId: z.string().uuid(),
    memberPhone: z.string(),
    memberFullName: z.string(),
    librarianId: z.string().uuid(),
    librarianFullName: z.string(),
    bookNames: z.array(z.string()),
    warning: z.array(z.string()),
  })
  .strict();
export type LoanType = z.TypeOf<typeof Loan>;

export const LoanPaginatedRes = z
  .object({
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
    items: z.array(Loan),
  })
  .strict();
export type LoanPaginatedResType = z.TypeOf<typeof LoanPaginatedRes>;

export const CreateLoanBody = z
  .object({
    memberPhone: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống!" })
      .max(11, { message: "Số điện thoại không đúng định dạng!" }),
    bookIdAndQuantity: z
      .array(z.string())
      .min(1, { message: "Chọn ít nhất 1 cuốn sách!" }),
    dueDate: z.date({
      required_error: "Chọn ngày trả sách!",
    }),
  })
  .strict()
  .superRefine(({ memberPhone }, ctx) => {
    if (!phoneFormatTest(memberPhone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không đúng định dạng",
        path: ["memberPhone"],
      });
    }
  });
export type CreateLoanBodyType = z.TypeOf<typeof CreateLoanBody>;

export const MemberCreateLoanBody = z
  .object({
    bookIdAndQuantity: z
      .array(z.string())
      .min(1, { message: "Chọn ít nhất 1 cuốn sách!" }),
    loanDate: z.date({
      required_error: "Chọn ngày mượn sách!",
    }),
    dueDate: z.date({
      required_error: "Chọn ngày trả sách!",
    }),
  })
  .strict()
  .superRefine(({ loanDate, dueDate }, ctx) => {
    if (dueDate <= loanDate) {
      ctx.addIssue({
        code: "custom",
        message: "Ngày trả sách phải sau ngày mượn sách!",
        path: ["dueDate"],
      });
    }
  });
export type MemberCreateLoanBodyType = z.TypeOf<typeof MemberCreateLoanBody>;

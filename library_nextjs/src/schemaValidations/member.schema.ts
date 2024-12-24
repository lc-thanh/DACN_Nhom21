import { phoneFormatTest } from "@/lib/utils";
import { z } from "zod";

export const MemberStatus = z.enum(["Normal", "OnLoan", "Overdue"]);
export type MemberStatusType = z.TypeOf<typeof MemberStatus>;

export const Member = z
  .object({
    id: z.string().uuid(),
    fullName: z.string(),
    individualId: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    dateOfBirth: z.string(),
    createdOn: z.string(),
    loansCount: z.number(),
    status: MemberStatus,
    isLocked: z.boolean(),
  })
  .strict();
export type MemberType = z.TypeOf<typeof Member>;

export const MemberPaginatedRes = z
  .object({
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
    items: z.array(Member),
  })
  .strict();
export type MemberPaginatedResType = z.TypeOf<typeof MemberPaginatedRes>;

export const CreateMemberBody = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, {
        message: "Họ tên phải có tối thiểu 2 ký tự",
      })
      .max(100, {
        message: "Họ tên quá dài",
      }),
    individualId: z.string().length(10, {
      message: "Mã sinh viên/giảng viên phải có 10 ký tự!",
    }),
    phone: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống!" })
      .max(11, { message: "Số điện thoại không đúng định dạng!" }),
    email: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.string().email({ message: "Email không đúng!" }).optional()),
  })
  .strict()
  .superRefine(({ phone }, ctx) => {
    if (!phoneFormatTest(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không đúng định dạng",
        path: ["phone"],
      });
    }
  });
export type CreateMemberBodyType = z.TypeOf<typeof CreateMemberBody>;

import { phoneFormatTest } from "@/lib/utils";
import { z } from "zod";

export const RoleEnum = z.enum(["Admin", "Librarian"]);
export type RoleEnumType = z.TypeOf<typeof RoleEnum>;

export const Staff = z
  .object({
    id: z.string().uuid(),
    fullName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    address: z.string(),
    dateOfBirth: z.string(),
    createdOn: z.string(),
    loansCount: z.number(),
    role: RoleEnum,
    isLocked: z.boolean(),
  })
  .strict();
export type StaffType = z.TypeOf<typeof Staff>;

export const StaffPaginatedRes = z
  .object({
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
    items: z.array(Staff),
  })
  .strict();
export type StaffPaginatedResType = z.TypeOf<typeof StaffPaginatedRes>;

export const CreateStaffBody = z
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
    phone: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống!" })
      .max(11, { message: "Số điện thoại không đúng định dạng!" }),
    email: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.string().email({ message: "Email không đúng!" }).optional()),
    role: z.enum(RoleEnum.options, { message: "Hãy chọn vai trò!" }),
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
export type CreateStaffBodyType = z.TypeOf<typeof CreateStaffBody>;

export const UpdateStaffBody = z
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
export type UpdateStaffBodyType = z.TypeOf<typeof UpdateStaffBody>;

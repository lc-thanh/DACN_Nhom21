import z from "zod";

export const RegisterBody = z
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
    email: z
      .string()
      .email({ message: "Email không đúng!" })
      .optional()
      .or(z.literal("")),
    // role: z.enum(["student", "teacher"], {
    //   required_error: "Chọn 1 trong 2 vai trò",
    // }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự!" })
      .max(100, { message: "Mật khẩu quá dài!" }),
    confirmPassword: z.string(),
  })
  .strict()
  .superRefine(({ confirmPassword, password, phone }, ctx) => {
    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu phải có ít nhất 1 chữ cái viết hoa!",
        path: ["password"],
      });
    }

    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu phải có ít nhất 1 chữ cái viết thường!",
        path: ["password"],
      });
    }

    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu phải có ít nhất 1 chữ số!",
        path: ["password"],
      });
    }

    if (!/[\W_]/.test(password)) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!",
        path: ["password"],
      });
    }

    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }

    const phonePattern: RegExp = /^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$/;
    if (!phonePattern.test(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không đúng định dạng",
        path: ["phone"],
      });
    }
  });
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiration: z.string(),
  }),
  message: z.string(),
});
export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
  .object({
    phone: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống!" })
      .max(11, { message: "Số điện thoại không đúng định dạng!" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự!" })
      .max(100, { message: "Mật khẩu quá dài!" }),
  })
  .strict()
  .superRefine(({ phone }, ctx) => {
    const phonePattern: RegExp = /^(03|05|07|08|09|01[2|6|8|9])([0-9]{8})$/;
    if (!phonePattern.test(phone)) {
      ctx.addIssue({
        code: "custom",
        message: "Số điện thoại không đúng định dạng",
        path: ["phone"],
      });
    }
  });
export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = RegisterRes;
export type LoginResType = z.TypeOf<typeof LoginRes>;

export const SlideSessionBody = z.object({}).strict();
export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;

export const SlideSessionRes = RegisterRes;
export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

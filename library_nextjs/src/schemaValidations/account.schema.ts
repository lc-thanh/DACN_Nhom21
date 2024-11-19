import { z } from "zod";

export const AccountRes = z
  .object({
    fullName: z.string(),
    phone: z.string(),
    individualId: z.string().nullable().optional(),
    email: z.string().email().nullable(),
    address: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
  })
  .strict();
export type AccountResType = z.TypeOf<typeof AccountRes>;

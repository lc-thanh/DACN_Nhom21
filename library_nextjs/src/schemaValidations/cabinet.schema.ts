import { z } from "zod";

export const Cabinet = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    createdOn: z.string(),
    bookShelfNames: z.array(z.string()),
    location: z.string(),
  })
  .strict();
export type CabinetType = z.TypeOf<typeof Cabinet>;

export const CreateCabinetBody = z.object({
  name: z
    .string()
    .min(1, { message: "Tên tủ sách không được để trống!" })
    .max(50, { message: "Tên tủ sách quá dài!" }),
  location: z.preprocess((value) => {
    if (value === "") return undefined;
    return value;
  }, z.string().max(50, { message: "Vị trí tủ sách quá dài!" }).optional().or(z.literal(""))),
});
export type CreateCabinetBodyType = z.TypeOf<typeof CreateCabinetBody>;

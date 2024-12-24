import { z } from "zod";

export const Bookshelf = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    createdOn: z.string(),
    cabinetId: z.string().uuid(),
    cabinetName: z.string(),
    booksCount: z.number(),
  })
  .strict();
export type BookshelfType = z.TypeOf<typeof Bookshelf>;

export const CreateBookshelfBody = z.object({
  name: z
    .string()
    .min(1, { message: "Tên ngăn sách không được để trống!" })
    .max(50, { message: "Tên ngăn sách quá dài!" }),
  cabinetId: z.preprocess((value) => {
    if (value === "") return undefined;
    return value;
  }, z.string({ required_error: "Phải chọn tủ sách!" }).uuid()),
});
export type CreateBookshelfBodyType = z.TypeOf<typeof CreateBookshelfBody>;

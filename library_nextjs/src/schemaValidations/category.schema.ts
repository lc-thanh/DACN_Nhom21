import { z } from "zod";

export const Category = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    createdOn: z.string(),
    booksCount: z.number(),
  })
  .strict();
export type CategoryType = z.TypeOf<typeof Category>;

export const CreateCategoryBody = z.object({
  name: z
    .string()
    .min(1, { message: "Tên danh mục không được để trống!" })
    .max(255, { message: "Tên danh mục sách quá dài!" }),
  description: z.preprocess((value) => {
    if (value === "") return undefined;
    return value;
  }, z.string().max(2000, { message: "Mô tả danh mục quá dài!" }).optional().or(z.literal(""))),
});
export type CreateCategoryBodyType = z.TypeOf<typeof CreateCategoryBody>;

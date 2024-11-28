import { z } from "zod";

export const Book = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    publisher: z.string(),
    publishedYear: z.number(),
    quantity: z.number(),
    availableQuantity: z.number(),
    totalPages: z.number(),
    imageUrl: z.string(),
    description: z.string(),
    createdOn: z.string(),
    authorName: z.string(),
    categoryId: z.string().uuid(),
    categoryName: z.string(),
    bookShelfId: z.string().uuid(),
    bookShelfName: z.string(),
  })
  .strict();
export type BookType = z.TypeOf<typeof Book>;

export const BookPaginatedRes = z
  .object({
    pageIndex: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
    items: z.array(Book),
  })
  .strict();
export type BookPaginatedResType = z.TypeOf<typeof BookPaginatedRes>;

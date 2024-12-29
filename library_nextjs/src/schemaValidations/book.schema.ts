import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

export const Book = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    publisher: z.string(),
    publishedYear: z.number(),
    quantity: z.number(),
    availableQuantity: z.number(),
    totalPages: z.number(),
    price: z.number(),
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

export const CreateBookBody = z
  .object({
    image: z
      .any()
      .refine(
        (file) => file?.size <= MAX_FILE_SIZE || !file,
        `Dung lượng file tối đa là 5MB!`
      )
      .optional(),
    // .refine(
    //   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //   "Chỉ hỗ trợ các file có dạng: .jpg, .jpeg, .png and .webp"
    // ),
    title: z
      .string()
      .min(1, { message: "Tiêu đề sách không được để trống!" })
      .max(255, { message: "Tiêu đề sách quá dài!" }),
    quantity: z.coerce
      .number()
      .min(0, { message: "Số lượng sách không hợp lệ!" })
      .max(9999, { message: "Số lượng sách không hợp lệ!" }),
    totalPages: z.coerce
      .number()
      .min(0, { message: "Số trang không hợp lệ!" })
      .max(9999, { message: "Số trang không hợp lệ!" }),
    price: z.coerce
      .number()
      .min(0, { message: "Giá bìa không hợp lệ!" })
      .max(99999999, { message: "Giá bìa không hợp lệ!" }),
    publisher: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.string().max(100, { message: "Tên nhà xuất bản quá dài!" }).optional().or(z.literal(""))),
    publishedYear: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.coerce.number().min(1, { message: "Năm xuất bản không hợp lệ!" }).max(2099, { message: "Năm xuất bản không hợp lệ!" }).optional()),
    description: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.string().max(2000, { message: "Mô tả sách quá dài!" }).optional()),
    authorName: z.preprocess((value) => {
      if (value === "") return undefined;
      return value;
    }, z.string().max(100, { message: "Tên tác giả quá dài!" }).optional()),
    categoryId: z
      .string()
      .uuid({ message: "Danh mục sách không hợp lệ!" })
      .optional(),
    bookShelfId: z
      .string()
      .uuid({ message: "Ngăn sách không hợp lệ!" })
      .optional(),
  })
  .strict();
export type CreateBookBodyType = z.TypeOf<typeof CreateBookBody>;

export const LoanBook = z
  .object({
    book: Book,
    quantity: z.number(),
  })
  .strict();
export type LoanBookType = z.TypeOf<typeof LoanBook>;

import http from "@/lib/http";
import {
  BookPaginatedResType,
  BookType,
  CreateBookBodyType,
} from "@/schemaValidations/book.schema";

const bookApiRequests = {
  getBook: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<BookType>(`/Books/${id}`);
  },
  getBooks: async (params: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<BookPaginatedResType>(`/Books?${params}`);
  },
  create: async (data: CreateBookBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);

    const formData = new FormData();
    if (data.image) formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("quantity", data.quantity.toString());
    formData.append("totalPages", data.totalPages.toString());
    if (data.publisher) formData.append("publisher", data.publisher);
    if (data.publishedYear)
      formData.append("publishedYear", data.publishedYear.toString());
    if (data.description) formData.append("description", data.description);
    if (data.authorName) formData.append("authorName", data.authorName);
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.bookShelfId) formData.append("bookShelfId", data.bookShelfId);

    return http.post("/Books", formData);
  },
  update: async (
    id: string,
    {
      data,
      isImageChanged,
    }: { data: CreateBookBodyType; isImageChanged: boolean }
  ) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);

    const formData = new FormData();
    if (data.image) formData.append("image", data.image);
    formData.append("title", data.title);
    formData.append("quantity", data.quantity.toString());
    formData.append("totalPages", data.totalPages.toString());
    if (data.publisher) formData.append("publisher", data.publisher);
    if (data.publishedYear)
      formData.append("publishedYear", data.publishedYear.toString());
    if (data.description) formData.append("description", data.description);
    if (data.authorName) formData.append("authorName", data.authorName);
    if (data.categoryId) formData.append("categoryId", data.categoryId);
    if (data.bookShelfId) formData.append("bookShelfId", data.bookShelfId);
    formData.append("isUpdateImage", isImageChanged.toString());

    return http.put(`/Books/${id}`, formData);
  },
  delete: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Books/${id}`, null);
  },
  deleteArray: async (ids: string[]) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Books`, ids);
  },
};

export default bookApiRequests;

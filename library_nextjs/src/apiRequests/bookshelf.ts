import http from "@/lib/http";
import {
  BookshelfType,
  CreateBookshelfBodyType,
} from "@/schemaValidations/bookshelf.schema";

const bookshelfApiRequests = {
  get: async (id: string) => {
    return http.get<BookshelfType>(`/Bookshelves/${id}`);
  },
  getBookshelves: async () => {
    return http.get<BookshelfType[]>("/Bookshelves");
  },
  create: async (data: CreateBookshelfBodyType) => {
    return http.post("/Bookshelves", data);
  },
  update: async (id: string, data: CreateBookshelfBodyType) => {
    return http.put(`/Bookshelves/${id}`, data);
  },
  delete: async (id: string) => {
    return http.delete(`/Bookshelves/${id}`, null);
  },
  deleteArray: async (ids: string[]) => {
    return http.delete(`/Bookshelves`, ids);
  },
};

export default bookshelfApiRequests;

import http from "@/lib/http";
import {
  CategoryType,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.schema";

const categoryApiRequests = {
  get: async (id: string) => {
    return http.get<CategoryType>(`/Categories/${id}`);
  },
  getCategories: async () => {
    return http.get<CategoryType[]>("/Categories");
  },
  create: async (data: CreateCategoryBodyType) => {
    return http.post("/Categories", data);
  },
  update: async (id: string, data: CreateCategoryBodyType) => {
    return http.put(`/Categories/${id}`, data);
  },
  delete: async (id: string) => {
    return http.delete(`/Categories/${id}`, null);
  },
  deleteArray: async (ids: string[]) => {
    return http.delete(`/Categories`, ids);
  },
};

export default categoryApiRequests;

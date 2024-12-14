import http from "@/lib/http";
import {
  CategoryType,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.schema";

const categoryApiRequests = {
  getCategories: async () => {
    return http.get<CategoryType[]>("/Categories");
  },
  create: async (data: CreateCategoryBodyType) => {
    return http.post("/Categories", data);
  },
};

export default categoryApiRequests;

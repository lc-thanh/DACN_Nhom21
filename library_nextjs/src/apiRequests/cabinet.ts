import http from "@/lib/http";
import {
  CabinetType,
  CreateCabinetBodyType,
} from "@/schemaValidations/cabinet.schema";

const cabinetApiRequests = {
  get: async (id: string) => {
    return http.get<CabinetType>(`/Cabinets/${id}`);
  },
  getCabinets: async () => {
    return http.get<CabinetType[]>("/Cabinets");
  },
  create: async (data: CreateCabinetBodyType) => {
    return http.post("/Cabinets", data);
  },
  update: async (id: string, data: CreateCabinetBodyType) => {
    return http.put(`/Cabinets/${id}`, data);
  },
  delete: async (id: string) => {
    return http.delete(`/Cabinets/${id}`, null);
  },
  deleteArray: async (ids: string[]) => {
    return http.delete(`/Cabinets`, ids);
  },
};

export default cabinetApiRequests;

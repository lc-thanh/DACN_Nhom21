import http from "@/lib/http";
import {
  CreateMemberBodyType,
  MemberPaginatedResType,
  MemberType,
} from "@/schemaValidations/member.schema";

const memberApiRequests = {
  get: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<MemberType>(`/Members/${id}`);
  },
  getMembers: async (params: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<MemberPaginatedResType>(`/Members?${params}`);
  },
  create: async (body: CreateMemberBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post("/Members", body);
  },
  update: async (id: string, body: CreateMemberBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.put(`/Members/${id}`, body);
  },
  delete: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Members/${id}`, null);
  },
  findByPhone: async (phone: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<MemberType>(`/Members/find-by-phone/${phone}`);
  },
};
export default memberApiRequests;

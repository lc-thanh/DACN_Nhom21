import http from "@/lib/http";
import {
  CreateStaffBodyType,
  StaffPaginatedResType,
  StaffType,
  UpdateStaffBodyType,
} from "@/schemaValidations/staff.schema";

const staffApiRequests = {
  get: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<StaffType>(`/Staffs/${id}`);
  },
  getStaffs: async (params: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.get<StaffPaginatedResType>(`/Staffs?${params}`);
  },
  create: async (body: CreateStaffBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post("/Staffs", body);
  },
  update: async (id: string, body: UpdateStaffBodyType) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.put(`/Staffs/${id}`, body);
  },
  delete: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.delete(`/Staffs/${id}`, null);
  },
  changeRoleToLibrarian: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Staffs/${id}/change-role-to-librarian`, null);
  },
  changeRoleToAdmin: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Staffs/${id}/change-role-to-admin`, null);
  },
};
export default staffApiRequests;

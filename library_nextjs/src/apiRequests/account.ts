import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
  me: (accessToken: string | undefined) => {
    return http.get<AccountResType>("/Auths/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
  meClient: () => {
    return http.get<AccountResType>("/Auths/me");
  },
  resetPassword: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Users/${id}/reset-password`, null);
  },
  lock: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Users/${id}/lock`, null);
  },
  unlock: async (id: string) => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    return http.post(`/Users/${id}/unlock`, null);
  },
};

export default accountApiRequests;

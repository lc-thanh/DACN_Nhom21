import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiRequests = {
  me: (sessionToken: string | undefined) => {
    return http.get<AccountResType>("/Auths/me", {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
  },
  meClient: () => {
    return http.get<AccountResType>("/Auths/me");
  },
};

export default accountApiRequests;

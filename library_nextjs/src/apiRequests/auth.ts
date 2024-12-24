import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequests = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/Auths/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/Auths/signup", body),
  logoutFromNextServerToServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post<MessageResType>("/Auths/logout", refreshToken, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post<MessageResType>(
      "/api/auth/logout",
      { force },
      { baseUrl: "", signal }
    ),
  refreshTokenFromNextServerToServer: ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post<LoginResType>("/Auths/refresh-token", {
      accessToken,
      refreshToken,
    }),
  refreshTokenFromNextClientToNextServer: () =>
    http.post<LoginResType>("/api/auth/refresh-token", {}, { baseUrl: "" }),
};

export default authApiRequests;

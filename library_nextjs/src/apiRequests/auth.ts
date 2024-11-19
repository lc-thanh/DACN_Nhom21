import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "@/schemaValidations/auth.schema";

const authApiRequests = {
  login: (body: LoginBodyType) => http.post<LoginResType>("/Auths/login", body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResType>("/Auths/signup", body),
};

export default authApiRequests;

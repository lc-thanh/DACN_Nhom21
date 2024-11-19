/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

// Nên kế thừa từ Error để có thể sử dụng nhiều thuộc tính, phương thức có sẵn của Error
class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

class ClientSessionToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
}

export const clientSessionToken = new ClientSessionToken();

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${clientSessionToken.value}`,
  };
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy giá trị từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì => gọi API đến Next Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  // Kiểm tra xem nếu thiếu dấu / ở đầu url thì thêm vào
  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  const res = await fetch(fullUrl, {
    method,
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };

  if (!res.ok) {
    throw new HttpError(data);
  }

  if (/^(\/?Auths\/login)$/.test(url) || /^(\/?Auths\/signup)$/.test(url)) {
    // set token phía client
    clientSessionToken.value = (payload as LoginResType).data.token;
    // set token phía server
    await request("POST", "/api/auth", {
      baseUrl: "",
      body: { sessionToken: clientSessionToken.value } as unknown as BodyInit,
    });
  } else if (/^(\/?Auths\/logout)$/.test(url)) {
    clientSessionToken.value = "";
  }

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
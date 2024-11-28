/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;

type EntityErrorPayload = {
  field: string;
  message: string;
};

// Nên kế thừa từ Error để có thể sử dụng nhiều thuộc tính, phương thức có sẵn của Error
export class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

class ClientTokens {
  private _accessToken = "";
  get accessToken() {
    return this._accessToken;
  }
  set accessToken(token: string) {
    // Nếu gọi method này ở server thì sẽ bị lỗi
    // Vì nếu nhiều client sử dụng chung 1 object clientTokens thì sẽ bị overwrite
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._accessToken = token;
  }

  private _refreshToken = "";
  get refreshToken() {
    return this._refreshToken;
  }
  set refreshToken(token: string) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._refreshToken = token;
  }
}

export const clientTokens = new ClientTokens();

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;
  const baseHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${clientTokens.accessToken}`,
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
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else {
      throw new HttpError(data);
    }
  }

  if (/^(\/?Auths\/login)$/.test(url) || /^(\/?Auths\/signup)$/.test(url)) {
    // set token phía client
    if (typeof window !== "undefined") {
      clientTokens.accessToken = (payload as LoginResType).data.accessToken;
      clientTokens.refreshToken = (payload as LoginResType).data.refreshToken;
    }

    // set token phía server
    await request("POST", "/api/auth", {
      baseUrl: "",
      body: {
        accessToken: (payload as LoginResType).data.accessToken,
        refreshToken: (payload as LoginResType).data.refreshToken,
      } as unknown as BodyInit,
    });
  } else if (/^(\/?Auths\/logout)$/.test(url)) {
    if (typeof window !== "undefined") {
      clientTokens.accessToken = "";
      clientTokens.refreshToken = "";
    }
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

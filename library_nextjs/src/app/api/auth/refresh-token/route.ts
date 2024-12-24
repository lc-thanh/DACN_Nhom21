import authApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(_request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Không nhận được accessToken hoặc refreshToken!" },
      { status: 400 }
    );
  }

  try {
    const res = await authApiRequests.refreshTokenFromNextServerToServer({
      accessToken,
      refreshToken,
    });
    const newAccessToken = res.payload.data.accessToken;
    const newRefreshToken = res.payload.data.refreshToken;
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `accessToken=${newAccessToken}; Path=/; HttpOnly;`
    );
    headers.append(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; Path=/; HttpOnly`
    );

    return Response.json(res.payload, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "Lỗi không xác định!" }, { status: 500 });
    }
  }
}

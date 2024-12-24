import authApiRequests from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Xóa cookie
  const headers = new Headers();
  headers.append("Set-Cookie", `accessToken=; Path=/; HttpOnly; Max-Age=0`);
  headers.append("Set-Cookie", `refreshToken=; Path=/; HttpOnly; Max-Age=0`);

  const requestBody = await request.json();
  const force = requestBody.force as boolean | undefined;
  if (force) {
    return Response.json(
      { message: "Buộc đăng xuất thành công!" },
      { status: 200, headers: headers }
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value ?? "";
  const refreshToken = cookieStore.get("refreshToken")?.value ?? "";

  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Không nhận được accessToken hoặc refreshToken!" },
      { status: 400 }
    );
  }

  try {
    const result = await authApiRequests.logoutFromNextServerToServer({
      accessToken,
      refreshToken,
    });

    return Response.json(result.payload, {
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

import authApiRequests from "@/apiRequests/auth";
import { decodeJWT } from "@/lib/utils";
import { differenceInMinutes } from "date-fns";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const privatePaths = ["/dashboard", "/me"];
const authPaths = ["/login", "/signup"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const jwtPayload = accessToken ? decodeJWT(accessToken) : null;

  if (accessToken && refreshToken && jwtPayload) {
    let response = NextResponse.next();

    // Nếu truy cập vào trang login hoặc signup thì chuyển hướng về dashboard
    if (authPaths.some((path) => pathname.startsWith(path))) {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
      jwtPayload.role !== "Admin" &&
      pathname.startsWith("/dashboard/staff")
    ) {
      if (jwtPayload.role === "Librarian") {
        response = NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        response = NextResponse.redirect(new URL("/me", request.url));
      }
    }

    // Kiểm tra nếu accessToken sắp hết hạn thì refresh token
    // Và set lại cookies nếu thành công
    const now = new Date();
    const expiresAt = new Date(jwtPayload.exp * 1000).toUTCString();
    if (differenceInMinutes(new Date(expiresAt), now) < 1) {
      try {
        const { payload } =
          await authApiRequests.refreshTokenFromNextServerToServer({
            accessToken,
            refreshToken,
          });
        const newAccessToken = payload.data.accessToken;
        const newRefreshToken = payload.data.refreshToken;

        response.cookies.set({
          name: "accessToken",
          value: newAccessToken,
          path: "/",
          httpOnly: true,
        });
        response.cookies.set({
          name: "refreshToken",
          value: newRefreshToken,
          path: "/",
          httpOnly: true,
        });
      } catch (error) {
        console.log("Error refreshing token:", error);

        // Nếu refresh token lỗi thì force logout
        const response = NextResponse.redirect(
          new URL(`/login?redirectFrom=/force-logout`, request.url)
        );

        response.cookies.set({
          name: "accessToken",
          value: "",
          path: "/",
          httpOnly: true,
          maxAge: 0,
        });
        response.cookies.set({
          name: "refreshToken",
          value: "",
          path: "/",
          httpOnly: true,
          maxAge: 0,
        });
        return response;
      }
    }

    return response;
  }
  // Nếu Auth không thỏa mãn, thì về trang login
  else {
    if (privatePaths.some((path) => pathname.startsWith(path))) {
      if (accessToken) {
        return NextResponse.redirect(
          new URL(`/force-logout?accessToken=${accessToken}`, request.url)
        );
      }

      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Không được để matcher: [...privatePaths, ...authPaths] vì Nextjs sẽ không tính toán
  matcher: [
    "/dashboard/:path*",
    "/me/:path*",
    "/login/:path*",
    "/signup/:path*",
  ],
};

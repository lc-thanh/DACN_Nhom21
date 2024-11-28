import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Kiểm tra nếu người dùng truy cập vào đường dẫn bắt đầu bằng bất kỳ đường dẫn nào trong privatePaths và không có sessionToken
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    if (refreshToken) {
      // Gọi API để refresh token
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newSessionToken = data.sessionToken;
        const newRefreshToken = data.refreshToken;

        // Set lại cookie mới
        const response = NextResponse.next();
        response.cookies.set("sessionToken", newSessionToken, {
          path: "/",
          httpOnly: true,
        });
        response.cookies.set("refreshToken", newRefreshToken, {
          path: "/",
          httpOnly: true,
        });
        return response;
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Kiểm tra nếu người dùng truy cập vào đường dẫn bắt đầu bằng bất kỳ đường dẫn nào trong authPaths và đã có sessionToken
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/me", "/login", "/signup"],
};

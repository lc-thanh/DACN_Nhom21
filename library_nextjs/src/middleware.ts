import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/signup"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  // Kiểm tra nếu người dùng truy cập vào đường dẫn bắt đầu bằng bất kỳ đường dẫn nào trong privatePaths và không có sessionToken
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kiểm tra nếu người dùng truy cập vào đường dẫn bắt đầu bằng bất kỳ đường dẫn nào trong authPaths và đã có sessionToken
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // Không được để matcher: [...privatePaths, ...authPaths] vì Nextjs sẽ không tính toán
  matcher: ["/me", "/login", "/signup"],
};

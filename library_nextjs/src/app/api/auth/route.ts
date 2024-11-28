export async function POST(request: Request) {
  const res: {
    accessToken: string;
    refreshToken: string;
  } = await request.json();
  const accessToken = res.accessToken;
  const refreshToken = res.refreshToken;
  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: "Không nhận được accessToken hoặc refreshToken!" },
      { status: 400 }
    );
  }

  const headers = new Headers();
  headers.append("Set-Cookie", `accessToken=${accessToken}; Path=/; HttpOnly`);
  headers.append(
    "Set-Cookie",
    `refreshToken=${refreshToken}; Path=/; HttpOnly`
  );

  return Response.json(res, {
    status: 200,
    headers: headers,
  });
}

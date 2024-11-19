import { cookies } from "next/headers";

export async function POST(request: Request) {
  const res: {
    sessionToken: string;
  } = await request.json();
  const sessionToken = res.sessionToken;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được sessionToken!" },
      { status: 400 }
    );
  }

  return Response.json(
    { res },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${res.sessionToken}; Path=/; HttpOnly`,
      },
    }
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  return Response.json(
    { sessionToken },
    {
      status: 200,
    }
  );
}

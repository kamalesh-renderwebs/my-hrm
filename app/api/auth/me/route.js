import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json(
      {
        message: "Authenticated",
        user: {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
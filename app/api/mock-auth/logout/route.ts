import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: MOCK_AUTH_COOKIE,
    value: "",
    expires: new Date(0),
    path: "/"
  });
  return response;
}

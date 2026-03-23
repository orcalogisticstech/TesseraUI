import { defaultMockSession, encodeMockSession, MOCK_AUTH_COOKIE, MOCK_AUTH_MAX_AGE, type UserRole } from "@/lib/mock-auth";
import { NextResponse } from "next/server";

const roleProfiles: Record<UserRole, { userName: string; userEmail: string }> = {
  Admin: { userName: "Morgan Patel", userEmail: "morgan@orcalogistics.example" },
  Supervisor: { userName: "Avery Stone", userEmail: "avery@orcalogistics.example" },
  Operator: { userName: "Riley Chen", userEmail: "riley@orcalogistics.example" }
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { role?: UserRole };
  const role = body.role && body.role in roleProfiles ? body.role : defaultMockSession.role;
  const session = {
    ...defaultMockSession,
    role,
    userName: roleProfiles[role].userName,
    userEmail: roleProfiles[role].userEmail
  };

  const response = NextResponse.json({ ok: true, session });
  response.cookies.set({
    name: MOCK_AUTH_COOKIE,
    value: encodeMockSession(session),
    maxAge: MOCK_AUTH_MAX_AGE,
    path: "/",
    httpOnly: true,
    sameSite: "lax"
  });

  return response;
}

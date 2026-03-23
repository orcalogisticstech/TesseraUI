import { MOCK_AUTH_COOKIE, decodeMockSession } from "@/lib/mock-auth";
import { cookies } from "next/headers";

export async function getMockSession() {
  const store = await cookies();
  const rawValue = store.get(MOCK_AUTH_COOKIE)?.value;
  return decodeMockSession(rawValue);
}

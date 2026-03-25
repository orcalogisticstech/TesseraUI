export const MOCK_AUTH_COOKIE = "tessera_mock_auth";
export const MOCK_AUTH_MAX_AGE = 60 * 60 * 12;

export type UserRole = "Admin" | "Supervisor" | "Operator";

export type MockSession = {
  tenantId: string;
  tenantName: string;
  role: UserRole;
  userName: string;
  userEmail: string;
};

export const defaultMockSession: MockSession = {
  tenantId: "tenant-orca-east-1",
  tenantName: "Tessera East",
  role: "Supervisor",
  userName: "Avery Stone",
  userEmail: "avery@orcalogistics.example"
};

export function encodeMockSession(session: MockSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeMockSession(rawValue: string | undefined): MockSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(rawValue)) as MockSession;
    if (!parsed.tenantId || !parsed.tenantName || !parsed.role || !parsed.userName || !parsed.userEmail) {
      return null;
    }
    const tenantName = parsed.tenantName === "Orca Logistics East" ? "Tessera East" : parsed.tenantName;
    return { ...parsed, tenantName };
  } catch {
    return null;
  }
}

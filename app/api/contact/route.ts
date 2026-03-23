import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  platform?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const company = payload.company?.trim() ?? "";
  const platform = payload.platform?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name || !email || !company || !platform) {
    return NextResponse.json({ error: "Name, email, company, and WMS platform are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    submittedAt: new Date().toISOString(),
    submission: {
      name,
      email,
      company,
      platform,
      message
    }
  });
}

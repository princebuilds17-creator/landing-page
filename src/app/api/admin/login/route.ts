import { NextResponse } from "next/server";
import {
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
  verifyCredentials,
  setAdminSession,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    const clientIdentifier = email.trim().toLowerCase();
    const rateCheck = checkLoginRateLimit(clientIdentifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
        },
        { status: 429 }
      );
    }

    const isValid = verifyCredentials(email, password);
    if (!isValid) {
      recordFailedLogin(clientIdentifier);
      // PRD rule: Generic failure message that doesn't reveal whether email exists
      return NextResponse.json(
        { error: "Email atau kata sandi tidak valid" },
        { status: 401 }
      );
    }

    resetLoginAttempts(clientIdentifier);
    await setAdminSession(email);

    return NextResponse.json({ success: true, redirect: "/admin" });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server" },
      { status: 500 }
    );
  }
}

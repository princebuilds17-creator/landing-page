import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "prince_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "prince-lab-secure-secret-key-32chars-min!!";

// In-memory rate limiter for login
interface RateLimitEntry {
  attempts: number;
  blockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitEntry>();

export interface AdminSession {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

export function checkLoginRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry) return { allowed: true };

  if (entry.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  if (entry.attempts >= 5) {
    // Block for 5 minutes
    entry.blockedUntil = now + 5 * 60 * 1000;
    loginAttempts.set(identifier, entry);
    return { allowed: false, retryAfterSeconds: 300 };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(identifier) || { attempts: 0, blockedUntil: 0 };
  entry.attempts += 1;
  loginAttempts.set(identifier, entry);
}

export function resetLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

export function createToken(session: AdminSession): string {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature, "utf-8"),
        Buffer.from(expectedSignature, "utf-8")
      )
    ) {
      return null;
    }

    const session: AdminSession = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    );

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifyToken(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();
  const now = Date.now();
  const session: AdminSession = {
    email,
    role: "admin",
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const token = createToken(session);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Credentials validation
export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || "admin@princelab.id";
  const expectedPassword = process.env.ADMIN_PASSWORD || "princeAdmin2026!";

  const emailMatch = email.trim().toLowerCase() === expectedEmail.toLowerCase();
  
  // Timing safe password comparison
  const passBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(expectedPassword);
  
  if (passBuf.length !== expectedBuf.length) {
    return false;
  }

  const passMatch = crypto.timingSafeEqual(passBuf, expectedBuf);
  return emailMatch && passMatch;
}

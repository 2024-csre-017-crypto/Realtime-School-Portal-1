import { Request, Response } from "express";

export interface SessionUser {
  role: "admin" | "teacher" | "student";
  id: string;
  name: string;
}

export function getSession(req: Request): SessionUser | null {
  const cookie = req.signedCookies?.["school_session"];
  if (!cookie) return null;
  try {
    return JSON.parse(cookie) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(res: Response, user: SessionUser): void {
  res.cookie("school_session", JSON.stringify(user), {
    signed: true,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
}

export function clearSession(res: Response): void {
  res.clearCookie("school_session");
}

export function requireAuth(req: Request, res: Response): SessionUser | null {
  const user = getSession(req);
  if (!user) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }
  return user;
}

import { sign } from "hono/jwt";
import {
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  NODE_ENV,
} from "#config/index.js";
import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";
import type { JWTPayload } from "hono/utils/jwt/types";

type Payload = {
  userId: string;
  exp: number;
};

export async function createToken(userId: string, secret: string, exp: number) {
  try {
    const payload: Payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + exp,
    } satisfies JWTPayload;

    return await sign(payload, secret, "HS256");
  } catch (error) {
    console.log("createToken error:", error);

    return null;
  }
}

export function createHttpOnlyCookie(c: Context, value: string) {
  setCookie(c, JWT_COOKIE_NAME, value, {
    httpOnly: true,
    secure: NODE_ENV === "production" ? true : false,
    sameSite: "Strict",
    maxAge: parseInt(JWT_COOKIE_EXP_SEC),
  });
}

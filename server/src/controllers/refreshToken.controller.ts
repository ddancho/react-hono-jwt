import { createFactory } from "hono/factory";
import { getCookie } from "hono/cookie";
import {
  ACCESS_JWT_SECRET,
  ACCESS_JWT_TOKEN_EXP_SEC,
  JWT_COOKIE_NAME,
  REFRESH_JWT_SECRET,
} from "#config/index.js";
import { verify } from "hono/jwt";
import { createToken } from "#lib/auth.lib.js";
import type { User } from "#types/index.js";
import prisma from "#lib/prisma.lib.js";

const factory = createFactory();

export const checkRefreshToken = factory.createHandlers(async (c) => {
  try {
    const refreshToken = getCookie(c, JWT_COOKIE_NAME);

    if (!refreshToken) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const decodedPayload = await verify(refreshToken, REFRESH_JWT_SECRET);

    const userId: unknown = decodedPayload.userId;

    if (typeof userId !== "string" || userId === undefined || userId === null) {
      return c.json({ message: "Invalid refresh token" }, 403);
    }

    const user: User | null = await prisma.user.findUnique({
      where: {
        refreshToken,
      },
    });

    // refresh token expired or deleted ?
    if (user === null) {
      return c.json({ message: "Forbidden" }, 403);
    }

    // create new access jwt token
    const accessToken = await createToken(
      user.id,
      ACCESS_JWT_SECRET,
      parseInt(ACCESS_JWT_TOKEN_EXP_SEC)
    );
    if (!accessToken) {
      return c.json({ message: "Internal Server Error" }, 500);
    }

    return c.json({ accessToken }, 200);
  } catch (error) {
    console.log("checkRefreshToken error:", error);

    return c.json({ message: "Invalid refresh token" }, 403);
  }
});

import { createMiddleware } from "hono/factory";
import { ACCESS_JWT_SECRET, JWT_COOKIE_NAME } from "#config/index.js";
import { verify } from "hono/jwt";
import type { User } from "#types/index.js";
import prisma from "#lib/prisma.lib.js";

export const authProtectRoute = createMiddleware<{
  Variables: { user: User };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const decodedPayload = await verify(token, ACCESS_JWT_SECRET);

    const userId: unknown = decodedPayload.userId;

    if (typeof userId !== "string" || userId === undefined || userId === null) {
      return c.json({ message: "Invalid token" }, 403);
    }

    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user === null) {
      return c.json({ message: "Invalid token" }, 403);
    }

    c.set("user", user);
  } catch (error) {
    console.log("Middleware error:", error);

    return c.json({ message: "Invalid token" }, 403);
  }

  await next();
});

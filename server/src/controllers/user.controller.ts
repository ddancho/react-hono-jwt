import { authProtectRoute } from "#middleware/auth.middleware.js";
import { createFactory } from "hono/factory";
import type { UserDto } from "#types/index.js";

const factory = createFactory();

export const getCurrentUser = factory.createHandlers(authProtectRoute, (c) => {
  try {
    const user = c.var.user;

    const u: UserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    };

    return c.json(u, 200);
  } catch (error) {
    console.log("getCurrentUser error:", error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});

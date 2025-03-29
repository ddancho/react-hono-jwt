import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import {
  UserRegisterSchema,
  UserLoginSchema,
  type User,
  type UserDto,
} from "#types/index.js";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
  JWT_COOKIE_NAME,
  ACCESS_JWT_SECRET,
  ACCESS_JWT_TOKEN_EXP_SEC,
  REFRESH_JWT_SECRET,
  REFRESH_JWT_TOKEN_EXP_SEC,
  NODE_ENV,
} from "#config/index.js";
import { authProtectRoute } from "#middleware/auth.middleware.js";
import { createToken, createHttpOnlyCookie } from "#lib/auth.lib.js";
import prisma from "#lib/prisma.lib.js";
import bcrypt from "bcryptjs";

const factory = createFactory();

export const register = factory.createHandlers(
  zValidator("json", UserRegisterSchema),
  async (c) => {
    const validated = c.req.valid("json");

    try {
      // check if the email is used
      const usedEmail = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
        select: {
          id: true,
        },
      });

      if (usedEmail) {
        return c.json({ message: "Email is already used" }, 400);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(validated.password, salt);

      await prisma.user.create({
        data: {
          username: validated.username,
          email: validated.email,
          password: passwordHash,
        },
      });

      return c.json({ message: "User is successfully created" }, 201);
    } catch (error) {
      console.log("register user error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export const login = factory.createHandlers(
  zValidator("json", UserLoginSchema),
  async (c) => {
    const validated = c.req.valid("json");

    try {
      // find user
      const user: User | null = await prisma.user.findUnique({
        where: {
          email: validated.email,
        },
      });

      if (!user) {
        return c.json({ message: "Invalid credentials" }, 400);
      }

      const isValidated = await bcrypt.compare(
        validated.password,
        user.password!
      );
      if (!isValidated) {
        return c.json({ message: "Invalid credentials" }, 400);
      }

      // create access jwt token
      const accessToken = await createToken(
        user.id,
        ACCESS_JWT_SECRET,
        parseInt(ACCESS_JWT_TOKEN_EXP_SEC)
      );
      if (!accessToken) {
        return c.json({ message: "Internal Server Error" }, 500);
      }

      // create refresh jwt token
      const refreshToken = await createToken(
        user.id,
        REFRESH_JWT_SECRET,
        parseInt(REFRESH_JWT_TOKEN_EXP_SEC)
      );
      if (!refreshToken) {
        return c.json({ message: "Internal Server Error" }, 500);
      }

      // create cookie
      createHttpOnlyCookie(c, refreshToken);

      // update user info with refreshToken value
      await prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data: {
          refreshToken,
        },
      });

      // return user info with access token
      const u: UserDto = {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      return c.json(u, 200);
    } catch (error) {
      console.log("login user error:", error);

      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

export const logout = factory.createHandlers(authProtectRoute, async (c) => {
  // client needs to delete access token
  try {
    const refreshToken = getCookie(c, JWT_COOKIE_NAME);

    if (!refreshToken) {
      return c.status(204);
    }

    const isUser: User | null = await prisma.user.findUnique({
      where: {
        refreshToken,
      },
    });

    if (isUser === null) {
      // we should delete cookie
      deleteCookie(c, JWT_COOKIE_NAME);
      return c.status(204);
    }

    // from middleware
    const user = c.var.user;

    // isUser === user
    // logout correct user ?!
    if (user.id.trim() !== isUser.id.trim()) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // ok, reset refresh token
    await prisma.user.update({
      where: {
        id: user.id,
        email: user.email,
        refreshToken,
      },
      data: {
        refreshToken: null,
      },
    });

    deleteCookie(c, JWT_COOKIE_NAME);

    return c.json({ message: "User is successfully logged out" }, 200);
  } catch (error) {
    console.log("logout user error:", error);

    return c.json({ message: "Internal Server Error" }, 500);
  }
});

import { Hono } from "hono";
import { checkRefreshToken } from "#controllers/refreshToken.controller.js";

const refreshTokenRoutes = new Hono();

refreshTokenRoutes.get("/refresh-token", ...checkRefreshToken);

export default refreshTokenRoutes;

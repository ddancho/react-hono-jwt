import { Hono } from "hono";
import { getCurrentUser } from "#controllers/user.controller.js";

const userRoutes = new Hono();

userRoutes.get("/current-user", ...getCurrentUser);

export default userRoutes;

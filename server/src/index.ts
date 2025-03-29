import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { PORT, CORS_ORIGIN } from "#config/index.js";

import authRoutes from "#routes/auth.routes.js";
import userRoutes from "#routes/user.routes.js";
import refreshTokenRoutes from "#routes/refreshToken.routes.js";

const app = new Hono().basePath("/api");

app.use("*", async (c, next) => {
  const corsMiddleware = cors({
    origin: CORS_ORIGIN,
    allowHeaders: ["Origin", "Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

app.use(logger());

app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/", refreshTokenRoutes);

serve(
  {
    fetch: app.fetch,
    port: parseInt(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

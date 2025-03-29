import { HTTPException } from "hono/http-exception";
import dotenv from "dotenv";

function getConfigOutput() {
  const configOutput = dotenv.config({ path: "./.env" });

  if (configOutput.error || configOutput.parsed === undefined) {
    throw new HTTPException(500, { message: "Internal Server Error" });
  }

  return configOutput.parsed;
}

const {
  PORT,
  NODE_ENV,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  ACCESS_JWT_TOKEN_EXP_SEC,
  REFRESH_JWT_TOKEN_EXP_SEC,
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  CORS_ORIGIN,
} = getConfigOutput();

if (
  PORT === undefined ||
  NODE_ENV === undefined ||
  ACCESS_JWT_SECRET === undefined ||
  REFRESH_JWT_SECRET === undefined ||
  ACCESS_JWT_TOKEN_EXP_SEC === undefined ||
  REFRESH_JWT_TOKEN_EXP_SEC === undefined ||
  JWT_COOKIE_EXP_SEC === undefined ||
  JWT_COOKIE_NAME === undefined ||
  CORS_ORIGIN === undefined
) {
  throw new HTTPException(500, {
    message: "Internal Server Error, env var missing",
  });
}

export {
  PORT,
  NODE_ENV,
  ACCESS_JWT_SECRET,
  REFRESH_JWT_SECRET,
  ACCESS_JWT_TOKEN_EXP_SEC,
  REFRESH_JWT_TOKEN_EXP_SEC,
  JWT_COOKIE_EXP_SEC,
  JWT_COOKIE_NAME,
  CORS_ORIGIN,
};

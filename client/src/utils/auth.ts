import { AxiosError } from "axios";
import axiosSecureInstance, { axiosBaseInstance } from "../lib/axios";
import { User, UserSignUp, ServerResponse, UserSignIn } from "../types";
import { logAxiosErrors } from "../helpers";

export async function loginUser(
  data: UserSignIn,
  abortController: AbortController | null
): Promise<ServerResponse> {
  try {
    // we need to add withCredentials property
    // for the browser to accept set-cookie header from server
    const response = await axiosBaseInstance.post<User>("/auth/login", data, {
      signal: abortController?.signal,
      withCredentials: true,
    });

    const res: ServerResponse = {
      status: "success",
      user: response.data,
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("loginUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}

export async function logoutUser(
  authUser: User | null,
  abortController: AbortController | null
): Promise<ServerResponse> {
  try {
    await axiosSecureInstance.post(
      "/auth/logout",
      {
        accessToken: authUser?.accessToken, // see axios.ts file for explanation
      },
      {
        signal: abortController?.signal,
      }
    );

    const res: ServerResponse = {
      status: "success",
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("logoutUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}

export async function registerUser(
  data: UserSignUp,
  abortController: AbortController | null
): Promise<ServerResponse> {
  try {
    await axiosBaseInstance.post("/auth/register", data, {
      signal: abortController?.signal,
    });

    const res: ServerResponse = {
      status: "success",
    };

    return res;
  } catch (error) {
    const res: ServerResponse = {
      status: "error",
    };

    if (error instanceof AxiosError) {
      logAxiosErrors("registerUser", error.response);

      if (error.response && "message" in error.response.data) {
        res.message = error.response?.data.message as string;
      }
    }

    return res;
  }
}
export async function refreshMyToken(): Promise<string | null> {
  try {
    const response = await axiosBaseInstance.get("/refresh-token", {
      withCredentials: true,
    });

    if (
      response.data.accessToken &&
      typeof response.data.accessToken === "string"
    ) {
      return response.data.accessToken;
    }

    return null;
  } catch (error) {
    if (error instanceof AxiosError) {
      logAxiosErrors("refresh error:", error.response);
    }

    return null;
  }
}

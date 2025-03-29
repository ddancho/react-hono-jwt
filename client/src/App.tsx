import { Routes, Route } from "react-router";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "./context/AuthContext";
import { AxiosError } from "axios";
import { User } from "./types";
import { logAxiosErrors } from "./helpers";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import axiosSecureInstance from "./lib/axios";

function App() {
  const { authUser, setAuthUser } = useAuthContext();
  const [isAuthPending, setIsAuthPending] = useState(false);

  const checkCurrentUser = useCallback(async () => {
    try {
      setIsAuthPending(true);

      const response = await axiosSecureInstance.get<User>(
        "/users/current-user",
        {
          data: {
            accessToken: authUser?.accessToken, // see axios.ts file for explanation
          },
        }
      );

      setAuthUser(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosErrors("checkCurrentUser", error.response);
      }

      setAuthUser(null);
    } finally {
      setIsAuthPending(false);
    }
  }, [authUser, setAuthUser]);

  useEffect(() => {
    if (!authUser) {
      checkCurrentUser();
    }
  }, [authUser, checkCurrentUser]);

  if (isAuthPending && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <Navbar />

      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </main>
  );
}

export default App;

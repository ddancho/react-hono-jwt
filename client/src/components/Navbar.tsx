import { LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { logoutUser } from "../utils/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Navbar() {
  const { authUser, setAuthUser } = useAuthContext();
  const [abortController, setAbortController] =
    useState<AbortController | null>(() => {
      return new AbortController();
    });
  const pathname = useLocation().pathname.split("/")[1];

  const handleLogout = async () => {
    const res = await logoutUser(authUser, abortController);

    if (res.status === "error") {
      toast.error("Sign out failed. Try again later.");
      return;
    }

    toast.success("You are successfully signed out.");

    // clear states
    setAuthUser(null);
  };

  useEffect(() => {
    return () => {
      abortController?.abort();
      setAbortController(null);
    };
  }, [abortController]);

  return (
    <div className="navbar bg-base-300 fixed w-full top-0 z-1">
      <div className="flex items-center w-full px-4">
        <div className="flex items-center flex-1">
          <Link to="/" className="btn btn-ghost text-2xl">
            Home
          </Link>
          {authUser && (
            <span className="flex text-sm">
              SignIn as:
              <h2 className="pl-2 font-medium">{authUser.username}</h2>
            </span>
          )}
        </div>

        {!authUser && (
          <div className="flex gap-4">
            <Link
              to={pathname === "login" ? "/register" : "/login"}
              className="btn btn-sm border-cyan-50 gap-2"
            >
              <Settings className="size-5" />
              <span className="hidden sm:inline">
                {pathname === "login" ? "Sign Up" : "Sign In"}
              </span>
            </Link>
          </div>
        )}

        {authUser && (
          <>
            <button
              className="flex gap-2 items-center px-2 hover:cursor-pointer hover:bg-base-100 hover:rounded-box"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;

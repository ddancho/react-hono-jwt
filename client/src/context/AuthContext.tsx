/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";
import { User } from "../types";

type AuthContextType = {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProps = {
  children: React.ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProps) {
  const [authUser, setAuthUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext is null");
  }

  return context;
}

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserData = {
  userId: string | null;
};

type AuthContextType = {
  user: UserData | null;
  tokenChecker: (_token: string) => Promise<void>;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  const tokenChecker = async (token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/verify",
        {
          token,
        }
      );

      const userId = response.data?.destructToken?.userId;
      if (userId) {
        setUser({ userId });
      } else {
        router.push("/createProfile");
      }
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      router.push("/createProfile");
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login"); // optionally redirect to login
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) tokenChecker(token);
  }, []);

  return (
    <AuthContext.Provider value={{ user, tokenChecker, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

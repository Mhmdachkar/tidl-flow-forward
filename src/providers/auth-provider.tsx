import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getSession,
  getUserById,
  login as loginUser,
  logout as logoutUser,
  signup as signupUser,
} from "@/lib/auth-storage";
import type { LoginInput, SignupInput, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<{ error?: string }>;
  signup: (input: SignupInput) => Promise<{ error?: string }>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const session = getSession();
    if (!session) {
      setUser(null);
      return;
    }
    setUser(getUserById(session.userId));
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);
  }, [refresh]);

  const login = useCallback(async (input: LoginInput) => {
    const result = loginUser(input);
    if ("error" in result) {
      return { error: result.error };
    }
    setUser(result.user);
    return {};
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const result = signupUser(input);
    if ("error" in result) {
      return { error: result.error };
    }
    setUser(result.user);
    return {};
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refresh,
    }),
    [user, isLoading, login, signup, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

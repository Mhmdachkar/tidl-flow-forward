import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type AuthModalMode = "login" | "signup";

export interface AuthModalOptions {
  mode?: AuthModalMode;
  redirectTo?: string;
}

interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthModalMode;
  redirectTo: string;
  openModal: (opts?: AuthModalOptions) => void;
  setMode: (mode: AuthModalMode) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  isOpen: false,
  mode: "login",
  redirectTo: "/account",
  openModal: () => {},
  setMode: () => {},
  closeModal: () => {},
});

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");
  const [redirectTo, setRedirectTo] = useState("/account");

  const openModal = useCallback((opts?: AuthModalOptions) => {
    setMode(opts?.mode ?? "login");
    setRedirectTo(opts?.redirectTo ?? "/account");
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, redirectTo, openModal, setMode, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  return useContext(AuthModalContext);
}

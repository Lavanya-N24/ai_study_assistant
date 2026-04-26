"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../services/api";

// ── Types ────────────────────────────────────────────────────────────────────
type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean; // true while we check localStorage on mount
  userEmail: string | null;
};

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: (token: string) => Promise<void>;
};

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pages that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userEmail: null,
  });

  // ── Check token on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    setState({
      isAuthenticated: !!token,
      isLoading: false,
      userEmail: email,
    });
  }, []);

  // ── Redirect guard ───────────────────────────────────────────────────────
  useEffect(() => {
    if (state.isLoading) return; // still checking

    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (!state.isAuthenticated && !isPublic) {
      router.replace("/login");
    }
  }, [state.isAuthenticated, state.isLoading, pathname, router]);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.login(email, password);
      api.saveToken(data.token);
      localStorage.setItem("userEmail", email);
      setState({ isAuthenticated: true, isLoading: false, userEmail: email });
      router.push("/setup-profile");
    },
    [router]
  );

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(
    async (email: string, password: string) => {
      const data = await api.register(email, password);
      api.saveToken(data.token);
      localStorage.setItem("userEmail", email);
      setState({ isAuthenticated: true, isLoading: false, userEmail: email });
      router.push("/setup-profile");
    },
    [router]
  );

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    api.logout();
    localStorage.removeItem("userEmail");
    setState({ isAuthenticated: false, isLoading: false, userEmail: null });
    router.push("/login");
  }, [router]);

  // ── Google Login ─────────────────────────────────────────────────────────
  const googleLogin = useCallback(
    async (token: string) => {
      const data = await api.googleLogin(token);
      api.saveToken(data.token);
      
      // We don't have the email from the token payload on frontend easily here without decoding,
      // but we can decode it or just fetch it later. For now let's decode it basic way:
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || 'Google User';
        localStorage.setItem("userEmail", email);
        setState({ isAuthenticated: true, isLoading: false, userEmail: email });
      } catch (e) {
        // Fallback
        localStorage.setItem("userEmail", "Google User");
        setState({ isAuthenticated: true, isLoading: false, userEmail: "Google User" });
      }
      
      router.push("/setup-profile");
    },
    [router]
  );

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

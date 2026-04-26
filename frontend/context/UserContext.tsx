"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

type UserData = {
  fullName: string;
  email: string;
  university: string;
  profilePic?: string;
  profileCompleted?: boolean;
};

type UserContextType = {
  user: UserData;
  isProfileComplete: boolean;
  updateUser: (data: Partial<UserData>) => void;
  completeProfile: (data: { fullName: string; university: string }) => void;
};

/** Build the localStorage key so each account gets its own profile */
function storageKey(email: string) {
  return `ai-study-user-${email}`;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userEmail } = useAuth();

  const buildDefault = (email: string | null): UserData => ({
    fullName: "",
    email: email ?? "",
    university: "",
    profileCompleted: false,
  });

  const [user, setUser] = useState<UserData>(() => buildDefault(userEmail));

  // ── Sync with authenticated email ────────────────────────────────────────
  useEffect(() => {
    if (!userEmail) {
      setUser(buildDefault(null));
      return;
    }

    // Try to load saved profile for this specific email
    const saved = localStorage.getItem(storageKey(userEmail));
    if (saved) {
      try {
        const parsed: UserData = JSON.parse(saved);
        setUser({ ...parsed, email: userEmail });
        return;
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    }

    // No saved profile → fresh default (profileCompleted = false)
    setUser(buildDefault(userEmail));
  }, [userEmail]);

  const isProfileComplete = !!user.profileCompleted;

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      const next = { ...prev, ...data };
      if (userEmail) {
        localStorage.setItem(storageKey(userEmail), JSON.stringify(next));
      }
      return next;
    });
  };

  /** Called from the onboarding page to finalize the profile */
  const completeProfile = (data: { fullName: string; university: string }) => {
    setUser(prev => {
      const next = { ...prev, ...data, profileCompleted: true };
      if (userEmail) {
        localStorage.setItem(storageKey(userEmail), JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, isProfileComplete, updateUser, completeProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

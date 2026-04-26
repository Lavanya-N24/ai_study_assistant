"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

// Pages that render full-screen (no sidebar / header)
const FULL_SCREEN_PATHS = ["/", "/login", "/register", "/setup-profile"];

/** Redirects authenticated users who haven't completed their profile */
function ProfileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { isProfileComplete } = useUser();

  useEffect(() => {
    if (isLoading) return;

    const isSetupPage = pathname === "/setup-profile";
    const isPublic = FULL_SCREEN_PATHS.includes(pathname);

    // Authenticated + profile incomplete + not on setup page → redirect to setup
    if (isAuthenticated && !isProfileComplete && !isPublic) {
      router.replace("/setup-profile");
    }
  }, [isAuthenticated, isProfileComplete, isLoading, pathname, router]);

  return <>{children}</>;
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_PATHS.includes(pathname);

  if (isFullScreen) {
    // Landing page gets the Navbar; auth pages render completely standalone
    const isLanding = pathname === "/";
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground relative z-10 w-full h-full overflow-hidden font-sans transition-colors duration-300">
        {isLanding && (
          <>
            <div className="fixed top-[-10%] right-[-5%] w-[700px] h-[700px] bg-themePurple-100/50 dark:bg-themePurple-900/20 rounded-full blur-[140px] -z-10 pointer-events-none transition-colors duration-300 shadow-2xl" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-50/70 dark:bg-fuchsia-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-300" />
            <Navbar />
          </>
        )}
        <main className={isLanding ? "flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : "flex-1"}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <ProfileGuard>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Soft atmospheric purple gradients for the dashboard pages */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-themePurple-100/40 dark:bg-themePurple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none transition-colors duration-300" />
          <div className="fixed bottom-0 left-[20%] w-[500px] h-[500px] bg-fuchsia-50/50 dark:bg-fuchsia-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-300" />

          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProfileGuard>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import api from "@/lib/axios";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setAccessToken, clearAuth } = useAuthStore();

  // on mount — if we have a refresh token but no user in memory
  // (e.g. page refresh cleared Zustand state), silently restore the session
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        router.push("/login");
        return;
      }

      if (!user) {
        try {
          // get new access token using refresh token
          const { data: refreshData } = await api.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
          );

          const newAccessToken = refreshData.data.accessToken;
          const newRefreshToken = refreshData.data.refreshToken;

          setAccessToken(newAccessToken);

          Cookies.set("refreshToken", newRefreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          // fetch user profile
          const { data: profileData } = await api.get("/users/me");
          setUser(profileData.data);

          Cookies.set("userRole", profileData.data.role, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        } catch {
          clearAuth();
          Cookies.remove("refreshToken");
          router.push("/login");
        }
      }
    };

    restoreSession();
  }, [user, setUser, clearAuth, setAccessToken, router]);

  // show nothing while restoring session
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

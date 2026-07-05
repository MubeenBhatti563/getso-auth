"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import api from "@/lib/axios";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setAccessToken, clearAuth } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        router.push("/login");
        return;
      }

      if (!user) {
        try {
          const { data: refreshData } = await api.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
          );

          setAccessToken(refreshData.data.accessToken);

          Cookies.set("refreshToken", refreshData.data.refreshToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          const { data: profileData } = await api.get("/users/me");
          const userData = profileData.data;

          if (userData.role !== "ADMIN") {
            router.push("/dashboard");
            return;
          }

          setUser(userData);
        } catch {
          clearAuth();
          Cookies.remove("refreshToken");
          Cookies.remove("userRole");
          router.push("/login");
        }
      }
    };

    restoreSession();
  }, [clearAuth, user, router, setAccessToken, setUser]);

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

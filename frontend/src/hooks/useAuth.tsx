"use client";
import api from "@/lib/axios";
import { LoginFormData, RegisterFormData } from "@/lib/validation/auth";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const { setAccessToken, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const register = async (data: RegisterFormData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  };

  const login = async (data: LoginFormData) => {
    const response = await api.post("/auth/login", data);
    const { accessToken, refreshToken } = response.data.data;

    setAccessToken(accessToken);

    Cookies.set("refreshToken", refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const profileResponse = await api.get("/users/me");
    const userData = profileResponse.data.data;
    setUser(userData);

    // store role in cookie so middleware can read it
    Cookies.set("userRole", userData.role, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // redirect based on role
    if (userData.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get("refreshToken");
      await api.post("/auth/logout", { refreshToken });
    } finally {
      clearAuth();
      Cookies.remove("refreshToken");
      Cookies.remove("userRole");
      router.push("/login");
    }
  };

  const forgotPassword = async (data: { email: string }) => {
    const responce = await api.post("/auth/forgot-password", data);
    return responce.data.data;
  };

  const resetPassword = async (data: {
    token: string;
    newPassword: string;
  }) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data.data;
  };

  const verifyEmail = async (data: { token: string }) => {
    const response = await api.post("/auth/verify-email", data);
    return response.data.data;
  };

  return {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
};

export default useAuth;

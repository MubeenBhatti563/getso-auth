"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LuMail,
  LuLock,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuShieldCheck,
} from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { LoginFormData, loginShema } from "@/lib/validation/auth";
import { getErrorMessage } from "@/lib/utils/errors";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginShema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <LuShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-zinc-100">Getso Auth</span>
        </div>
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-zinc-100 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-500">
              Sign in to your account to continue
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-950 border border-red-900 rounded-lg">
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <div className="relative">
                <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.email ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.password ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? (
                    <LuEyeOff className="w-4 h-4" />
                  ) : (
                    <LuEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              loading={isSubmitting}
            >
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 mt-5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <LuArrowLeft className="w-3 h-3" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

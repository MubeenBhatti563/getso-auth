"use client";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils/errors";
import { ResetPasswordFormData, resetSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  LuArrowLeft,
  LuCheck,
  LuEye,
  LuEyeOff,
  LuLock,
  LuShieldCheck,
} from "react-icons/lu";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    console.log(data);
    setServerError(null);
    try {
      await resetPassword({ token: token || "", newPassword: data.password });
      setSuccess(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <LuShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-zinc-100">Getso Auth</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 text-center">
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-medium text-zinc-100 mb-2">
              Password reset
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Your password has been reset successfully. Sign in with your new
              password.
            </p>
            <Link href="/login">
              <Button className="w-full">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
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
              Set new password
            </h1>
            <p className="text-sm text-zinc-500">
              Choose a strong password for your account.
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
            {/* New password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">
                New password
              </label>
              <div className="relative">
                <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.password ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
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

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">
                Confirm password
              </label>
              <div className="relative">
                <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.confirmPassword ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showConfirm ? (
                    <LuEyeOff className="w-4 h-4" />
                  ) : (
                    <LuEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              loading={isSubmitting}
            >
              Reset password
            </Button>
          </form>
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
};
export default ResetPassword;

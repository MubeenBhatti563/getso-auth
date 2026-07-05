"use client";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils/errors";
import { ForgotPasswordFormData, forgotSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LuArrowLeft, LuCheck, LuMail, LuShieldCheck } from "react-icons/lu";

const ForgotPasswordPage = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await forgotPassword(data);
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
            <div className="w-12 h-12 bg-violet-950 border border-violet-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuCheck className="w-6 h-6 text-violet-400" />
            </div>
            <h2 className="text-lg font-medium text-zinc-100 mb-2">
              Check your email
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              If that email exists, we sent a password reset link. It expires in
              1 hour.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Back to sign in
              </Button>
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
              Forgot your password?
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Enter your email and we&apos;ll send you a reset link.
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

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              loading={isSubmitting}
            >
              Send reset link
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <p className="text-center text-sm text-zinc-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              Sign in
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
};

export default ForgotPasswordPage;

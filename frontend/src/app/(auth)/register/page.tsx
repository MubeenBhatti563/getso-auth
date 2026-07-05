"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LuShieldCheck,
  LuMail,
  LuLock,
  LuUser,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuCheck,
} from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { RegisterFormData, registerSchema } from "@/lib/validation/auth";
import { getErrorMessage } from "@/lib/utils/errors";

// password strength checker
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { score: 1, label: "Weak", color: "bg-red-500" },
    { score: 2, label: "Fair", color: "bg-amber-500" },
    { score: 3, label: "Good", color: "bg-blue-500" },
    { score: 4, label: "Strong", color: "bg-emerald-500" },
  ];

  return map[score - 1] ?? { score: 0, label: "", color: "" };
}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data);
      setSuccess(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  // success state — show message instead of form
  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 mt-4">
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
              Check your email
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              We sent a verification link to your email address. Click it to
              activate your account.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Go to sign in
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
              Create an account
            </h1>
            <p className="text-sm text-zinc-500">
              Get started with Getso Auth today
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
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">
                Full name
              </label>
              <div className="relative">
                <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Mubeen Bhatti"
                  autoComplete="name"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.name ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

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
              <label className="text-sm font-medium text-zinc-300">
                Password
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

              {/* Password strength bar */}
              {password && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${i <= strength.score ? strength.color : "bg-zinc-800"}`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-zinc-500">
                      Strength:{" "}
                      <span
                        className={`font-medium
                        ${strength.score === 1 ? "text-red-400" : ""}
                        ${strength.score === 2 ? "text-amber-400" : ""}
                        ${strength.score === 3 ? "text-blue-400" : ""}
                        ${strength.score === 4 ? "text-emerald-400" : ""}
                      `}
                      >
                        {strength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}

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
              Create account
            </Button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-zinc-600 mt-4 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              href="#"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
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
}

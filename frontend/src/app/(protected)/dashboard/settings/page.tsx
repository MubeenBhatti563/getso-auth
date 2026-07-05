"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  LuLock,
  LuEye,
  LuEyeOff,
  LuCircleCheck,
  LuTriangleAlert,
  LuLogOut,
} from "react-icons/lu";
import { Navbar } from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils/errors";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { logout } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      await api.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-zinc-100 mb-1">Settings</h1>
          <p className="text-sm text-zinc-500">
            Manage your security preferences.
          </p>
        </div>

        {/* Change password */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
            <LuLock className="w-4 h-4 text-violet-400" />
            Change password
          </h2>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-950 border border-red-900 rounded-lg">
              <p className="text-sm text-red-400">{serverError}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 px-4 py-3 bg-emerald-950 border border-emerald-900 rounded-lg flex items-center gap-2">
              <LuCircleCheck className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-400">
                Password changed successfully.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Current password */}
            {[
              {
                name: "currentPassword" as const,
                label: "Current password",
                show: showCurrent,
                toggle: () => setShowCurrent((p) => !p),
              },
              {
                name: "newPassword" as const,
                label: "New password",
                show: showNew,
                toggle: () => setShowNew((p) => !p),
              },
              {
                name: "confirmPassword" as const,
                label: "Confirm new password",
                show: showConfirm,
                toggle: () => setShowConfirm((p) => !p),
              },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-300">
                  {field.label}
                </label>
                <div className="relative">
                  <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    {...register(field.name)}
                    type={field.show ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                      ${errors[field.name] ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                  />
                  <button
                    type="button"
                    onClick={field.toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {field.show ? (
                      <LuEyeOff className="w-4 h-4" />
                    ) : (
                      <LuEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors[field.name] && (
                  <p className="text-xs text-red-400">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}

            <Button type="submit" loading={isSubmitting} className="w-full">
              Update password
            </Button>
          </form>
        </div>

        {/* Sessions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
            <LuLogOut className="w-4 h-4 text-violet-400" />
            Sessions
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Sign out from all devices. You will need to log in again.
          </p>
          <Button
            variant="outline"
            onClick={logout}
            className="w-full border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300"
          >
            Sign out all devices
          </Button>
        </div>

        {/* Danger zone */}
        <div className="bg-zinc-900 border border-red-900 rounded-xl p-5">
          <h2 className="text-sm font-medium text-red-400 mb-4 flex items-center gap-2">
            <LuTriangleAlert className="w-4 h-4" />
            Danger zone
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Permanently delete your account and all associated data. This cannot
            be undone.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300"
            >
              Delete account
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-red-400 text-center">
                Are you sure? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await api.delete("/users/me");
                      logout();
                    } catch (error) {
                      setServerError(getErrorMessage(error));
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 border-0"
                >
                  Yes, delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

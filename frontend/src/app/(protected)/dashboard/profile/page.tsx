"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  LuUser,
  LuMail,
  LuShield,
  LuSave,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { Navbar } from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils/errors";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      const response = await api.patch("/users/me", data);
      setUser({ ...user!, name: response.data.data.name });
      setSuccess(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-zinc-100 mb-1">Profile</h1>
          <p className="text-sm text-zinc-500">Manage your account details.</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-xl font-medium text-white">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="text-base font-medium text-zinc-100">
              {user?.name ?? "—"}
            </p>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <span
              className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium
              ${
                user?.role === "ADMIN"
                  ? "bg-violet-950 border border-violet-900 text-violet-400"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-400"
              }`}
            >
              <LuShield className="w-3 h-3" />
              {user?.role}
            </span>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
            <LuUser className="w-4 h-4 text-violet-400" />
            Personal information
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
                Profile updated successfully.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">
                Full name
              </label>
              <div className="relative">
                <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-zinc-950 border text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all
                    ${errors.name ? "border-red-500" : "border-zinc-700 hover:border-zinc-600"}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <div className="relative">
                <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-zinc-600">Email cannot be changed.</p>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty}
              className="w-full"
            >
              <LuSave className="w-4 h-4 mr-2" />
              Save changes
            </Button>
          </form>
        </div>

        {/* Verification status */}
        <div
          className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border
          ${
            user?.verified
              ? "bg-emerald-950 border-emerald-900"
              : "bg-amber-950 border-amber-900"
          }`}
        >
          {user?.verified ? (
            <LuCircleCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          ) : (
            <LuCircleAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          )}
          <div>
            <p
              className={`text-sm font-medium mb-0.5 ${user?.verified ? "text-emerald-400" : "text-amber-400"}`}
            >
              {user?.verified ? "Email verified" : "Email not verified"}
            </p>
            <p
              className={`text-xs leading-relaxed ${user?.verified ? "text-emerald-600" : "text-amber-600"}`}
            >
              {user?.verified
                ? "Your email address has been verified."
                : "Check your inbox for the verification link we sent when you registered."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

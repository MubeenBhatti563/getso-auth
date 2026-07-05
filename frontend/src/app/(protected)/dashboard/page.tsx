"use client";

import {
  LuShieldCheck,
  LuKey,
  LuUsers,
  LuClock,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { useAuthStore } from "@/store/auth.store";
import { Navbar } from "@/components/dashboard/Navbar";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    {
      label: "Account status",
      value: user?.verified ? "Verified" : "Unverified",
      icon: user?.verified ? LuCircleCheck : LuCircleAlert,
      color: user?.verified ? "text-emerald-400" : "text-amber-400",
      bg: user?.verified
        ? "bg-emerald-950 border-emerald-900"
        : "bg-amber-950 border-amber-900",
    },
    {
      label: "Role",
      value: user?.role === "ADMIN" ? "Administrator" : "Customer",
      icon: LuUsers,
      color: "text-violet-400",
      bg: "bg-violet-950 border-violet-900",
    },
    {
      label: "Auth method",
      value: "JWT + Refresh",
      icon: LuKey,
      color: "text-blue-400",
      bg: "bg-blue-950 border-blue-900",
    },
    {
      label: "Session",
      value: "Active",
      icon: LuClock,
      color: "text-emerald-400",
      bg: "bg-emerald-950 border-emerald-900",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-zinc-100 mb-1">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-zinc-500">
            Here&apos;s an overview of your account.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div
                className={`w-8 h-8 ${stat.bg} border rounded-lg flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
              <p className={`text-sm font-medium ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Account details card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
              <LuUsers className="w-4 h-4 text-violet-400" />
              Account details
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Name</span>
                <span className="text-sm text-zinc-100">
                  {user?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Email</span>
                <span className="text-sm text-zinc-100">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Role</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                  ${
                    user?.role === "ADMIN"
                      ? "bg-violet-950 text-violet-400 border border-violet-900"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-zinc-500">Email verified</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
                  ${
                    user?.verified
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                      : "bg-amber-950 text-amber-400 border border-amber-900"
                  }`}
                >
                  {user?.verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Security info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-zinc-100 mb-4 flex items-center gap-2">
              <LuShieldCheck className="w-4 h-4 text-violet-400" />
              Security
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Access token</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900 font-medium">
                  Active · 15m TTL
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Refresh token</span>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900 font-medium">
                  Active · 7d TTL
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                <span className="text-xs text-zinc-500">Rate limiting</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-900 font-medium">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-zinc-500">Password hashing</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-900 font-medium">
                  bcrypt · 10 rounds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Unverified email warning */}
        {!user?.verified && (
          <div className="mt-4 flex items-start gap-3 px-4 py-3.5 bg-amber-950 border border-amber-900 rounded-xl">
            <LuCircleAlert className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-400 mb-0.5">
                Email not verified
              </p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Please check your inbox and click the verification link we sent
                when you registered.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

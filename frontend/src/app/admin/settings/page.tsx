"use client";

import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { LuShieldCheck, LuDatabase, LuClock, LuUsers } from "react-icons/lu";

const systemInfo = [
  { label: "Auth method", value: "JWT + Refresh tokens", icon: LuShieldCheck },
  { label: "Database", value: "PostgreSQL via Prisma", icon: LuDatabase },
  { label: "Access token TTL", value: "15 minutes", icon: LuClock },
  { label: "Refresh token TTL", value: "7 days", icon: LuClock },
  { label: "Max login attempts", value: "5 per 15 minutes", icon: LuUsers },
  {
    label: "Password hashing",
    value: "bcrypt · 10 rounds",
    icon: LuShieldCheck,
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-zinc-100 mb-1">Settings</h1>
          <p className="text-sm text-zinc-500">
            System configuration overview.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-100">
              System information
            </h2>
          </div>
          {systemInfo.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between px-5 py-4
                ${index !== systemInfo.length - 1 ? "border-b border-zinc-800" : ""}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-zinc-400">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-zinc-100">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

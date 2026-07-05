"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LuShieldCheck,
  LuLayoutDashboard,
  LuUser,
  LuSettings,
  LuLogOut,
  LuChevronDown,
  LuActivity,
} from "react-icons/lu";
import { useAuthStore } from "@/store/auth.store";
import useAuth from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0].toUpperCase() ?? "U");

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <LuShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-zinc-100">Getso Auth</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            <LuLayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            <LuUser className="w-4 h-4" />
            Profile
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            <LuSettings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href="/dashboard/sessions"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            <LuActivity className="w-4 h-4" />
            Sessions
          </Link>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-all"
          >
            {/* Avatar */}
            <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-zinc-100 leading-none">
                {user?.name ?? "User"}
              </span>
              <span className="text-xs text-zinc-500 leading-none mt-0.5">
                {user?.role === "ADMIN" ? "Administrator" : "Customer"}
              </span>
            </div>
            <LuChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-zinc-800">
                <p className="text-xs font-medium text-zinc-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>

              <div className="p-1">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
                >
                  <LuUser className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
                >
                  <LuSettings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950 transition-all"
                >
                  <LuLogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

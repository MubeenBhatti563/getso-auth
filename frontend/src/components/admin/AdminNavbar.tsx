"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuShieldCheck,
  LuLayoutDashboard,
  LuUsers,
  LuSettings,
  LuLogOut,
  LuChevronDown,
  LuShield,
} from "react-icons/lu";
import { useAuthStore } from "@/store/auth.store";
import useAuth from "@/hooks/useAuth";

export function AdminNavbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LuLayoutDashboard },
    { href: "/admin/users", label: "Users", icon: LuUsers },
    { href: "/admin/settings", label: "Settings", icon: LuSettings },
  ];

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + admin badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <LuShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-zinc-100">Getso Auth</span>
          </Link>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-950 border border-violet-900 rounded-full text-xs text-violet-400 font-medium">
            <LuShield className="w-3 h-3" />
            Admin
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                ${
                  pathname === link.href
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-all"
          >
            <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-zinc-100 leading-none">
                {user?.name ?? "Admin"}
              </span>
              <span className="text-xs text-violet-400 leading-none mt-0.5">
                Administrator
              </span>
            </div>
            <LuChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-zinc-800">
                <p className="text-xs font-medium text-zinc-100 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
              </div>
              <div className="p-1">
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

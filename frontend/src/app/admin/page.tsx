"use client";

import { useEffect, useState } from "react";
import {
  LuUsers,
  LuShieldCheck,
  LuTrendingUp,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import api from "@/lib/axios";

interface Stats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  customers: number;
}

interface User {
  verified: boolean;
  role: "ADMIN" | "CUSTOMER" | string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/users?page=1&limit=100");
        const users: User[] = data.data.data;

        setStats({
          total: data.data.meta.total,
          verified: users.filter((u: User) => u.verified).length,
          unverified: users.filter((u: User) => !u.verified).length,
          admins: users.filter((u: User) => u.role === "ADMIN").length,
          customers: users.filter((u: User) => u.role === "CUSTOMER").length,
        });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total users",
      value: stats?.total ?? 0,
      icon: LuUsers,
      color: "text-violet-400",
      bg: "bg-violet-950 border-violet-900",
    },
    {
      label: "Verified",
      value: stats?.verified ?? 0,
      icon: LuCircleCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-950 border-emerald-900",
    },
    {
      label: "Unverified",
      value: stats?.unverified ?? 0,
      icon: LuCircleAlert,
      color: "text-amber-400",
      bg: "bg-amber-950 border-amber-900",
    },
    {
      label: "Admins",
      value: stats?.admins ?? 0,
      icon: LuShieldCheck,
      color: "text-blue-400",
      bg: "bg-blue-950 border-blue-900",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-zinc-100 mb-1">
            Admin overview
          </h1>
          <p className="text-sm text-zinc-500">
            System-wide statistics and user management.
          </p>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse"
              >
                <div className="w-8 h-8 bg-zinc-800 rounded-lg mb-3" />
                <div className="h-3 bg-zinc-800 rounded w-16 mb-2" />
                <div className="h-5 bg-zinc-800 rounded w-8" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
              >
                <div
                  className={`w-8 h-8 ${card.bg} border rounded-lg flex items-center justify-center mb-3`}
                >
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-xs text-zinc-500 mb-1">{card.label}</p>
                <p className={`text-2xl font-medium ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/users"
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors group"
          >
            <div className="w-10 h-10 bg-violet-950 border border-violet-900 rounded-lg flex items-center justify-center">
              <LuUsers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100 mb-0.5">
                Manage users
              </p>
              <p className="text-xs text-zinc-500">
                View, search and update user roles
              </p>
            </div>
            <LuTrendingUp className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 ml-auto transition-colors" />
          </a>

          <a
            href="/dashboard"
            className="flex items-center gap-4 p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-950 border border-blue-900 rounded-lg flex items-center justify-center">
              <LuShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-100 mb-0.5">
                Your account
              </p>
              <p className="text-xs text-zinc-500">
                View your personal dashboard
              </p>
            </div>
            <LuTrendingUp className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 ml-auto transition-colors" />
          </a>
        </div>
      </main>
    </div>
  );
}

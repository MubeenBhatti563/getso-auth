"use client";

import { useEffect, useState } from "react";
import {
  LuUsers,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuShield,
  LuUser,
  LuLoader,
  LuCircleAlert,
  LuCircleCheck,
} from "react-icons/lu";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import api from "@/lib/axios";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN";
  verified: boolean;
  createdAt: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async (p = 1) => {
      try {
        const { data } = await api.get(`/users?page=${p}&limit=10`);
        setUsers(data.data.data);
        setMeta(data.data.meta);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers(page);
  }, [page]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    setUpdatingId(userId);
    try {
      const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
      await api.patch(`/users/${userId}/role`, { role: newRole });
      // update locally without refetching
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch {
      // handle error
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-zinc-100 mb-1">Users</h1>
            <p className="text-sm text-zinc-500">
              {meta?.total ?? 0} total users
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-800 text-xs text-zinc-500 font-medium">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Action</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LuLoader className="w-5 h-5 text-zinc-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <LuUsers className="w-8 h-8 text-zinc-700" />
              <p className="text-sm text-zinc-500">No users found</p>
            </div>
          ) : (
            filtered.map((user, index) => (
              <div
                key={user.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center text-sm transition-colors hover:bg-zinc-800/50
                  ${index !== filtered.length - 1 ? "border-b border-zinc-800" : ""}`}
              >
                {/* Name + initials */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium text-zinc-300 shrink-0">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : user.email[0].toUpperCase()}
                  </div>
                  <span className="text-zinc-100 truncate">
                    {user.name ?? "—"}
                  </span>
                </div>

                {/* Email */}
                <div className="col-span-3 text-zinc-400 truncate">
                  {user.email}
                </div>

                {/* Verified status */}
                <div className="col-span-2">
                  {user.verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950 border border-emerald-900 rounded-full text-xs text-emerald-400">
                      <LuCircleCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-950 border border-amber-900 rounded-full text-xs text-amber-400">
                      <LuCircleAlert className="w-3 h-3" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Role */}
                <div className="col-span-2">
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-violet-950 border border-violet-900 rounded-full text-xs text-violet-400">
                      <LuShield className="w-3 h-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-zinc-400">
                      <LuUser className="w-3 h-3" />
                      Customer
                    </span>
                  )}
                </div>

                {/* Role toggle */}
                <div className="col-span-1">
                  <button
                    onClick={() => handleRoleToggle(user.id, user.role)}
                    disabled={updatingId === user.id}
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-50"
                  >
                    {updatingId === user.id ? (
                      <LuLoader className="w-4 h-4 animate-spin" />
                    ) : user.role === "ADMIN" ? (
                      "Demote"
                    ) : (
                      "Promote"
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-zinc-500">
              Page {meta.page} of {meta.totalPages} · {meta.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <LuChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

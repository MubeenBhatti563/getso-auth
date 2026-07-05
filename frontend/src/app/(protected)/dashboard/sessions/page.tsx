"use client";

import { useEffect, useState } from "react";
import {
  LuMonitor,
  LuSmartphone,
  LuGlobe,
  LuTrash2,
  LuLoader,
  LuShieldCheck,
  LuTriangleAlert,
} from "react-icons/lu";
import { Navbar } from "@/components/dashboard/Navbar";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils/errors";

interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  expiresAt: string;
}

function getDeviceIcon(userAgent: string | null) {
  if (!userAgent) return LuGlobe;
  const ua = userAgent.toLowerCase();
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return LuSmartphone;
  }
  return LuMonitor;
}

function getDeviceName(userAgent: string | null): string {
  if (!userAgent) return "Unknown device";
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome")) return "Chrome browser";
  if (ua.includes("firefox")) return "Firefox browser";
  if (ua.includes("safari")) return "Safari browser";
  if (ua.includes("edge")) return "Edge browser";
  if (ua.includes("postman")) return "Postman";
  return "Unknown browser";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmAll, setShowConfirmAll] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/sessions");
        setSessions(data.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const revokeSession = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRevokingId(null);
    }
  };

  const revokeAll = async () => {
    setRevokingAll(true);
    try {
      await api.delete("/sessions/all");
      setSessions([]);
      setShowConfirmAll(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRevokingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-zinc-100 mb-1">
              Active sessions
            </h1>
            <p className="text-sm text-zinc-500">
              {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmAll(true)}
              className="border-red-900 text-red-400 hover:bg-red-950"
            >
              Revoke all
            </Button>
          )}
        </div>

        {/* Confirm revoke all */}
        {showConfirmAll && (
          <div className="mb-4 p-4 bg-red-950 border border-red-900 rounded-xl">
            <p className="text-sm text-red-400 mb-3 flex items-center gap-2">
              <LuTriangleAlert className="w-4 h-4 shrink-0" />
              This will sign you out of all devices including this one.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmAll(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                loading={revokingAll}
                onClick={revokeAll}
                className="flex-1 bg-red-600 hover:bg-red-700 border-0"
              >
                Yes, revoke all
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-950 border border-red-900 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Sessions list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LuLoader className="w-5 h-5 text-zinc-500 animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <LuShieldCheck className="w-8 h-8 text-zinc-700" />
            <p className="text-sm text-zinc-500">No active sessions</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session, index) => {
              const DeviceIcon = getDeviceIcon(session.userAgent);
              const isFirst = index === 0;

              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
                >
                  {/* Device icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                    ${
                      isFirst
                        ? "bg-violet-950 border border-violet-900"
                        : "bg-zinc-800 border border-zinc-700"
                    }`}
                  >
                    <DeviceIcon
                      className={`w-5 h-5 ${isFirst ? "text-violet-400" : "text-zinc-400"}`}
                    />
                  </div>

                  {/* Session info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-zinc-100">
                        {getDeviceName(session.userAgent)}
                      </p>
                      {isFirst && (
                        <span className="px-1.5 py-0.5 bg-violet-950 border border-violet-900 rounded-full text-xs text-violet-400">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {session.ipAddress ?? "Unknown IP"} · Signed in{" "}
                      {formatDate(session.createdAt)}
                    </p>
                    <p className="text-xs text-zinc-600">
                      Expires {formatDate(session.expiresAt)}
                    </p>
                  </div>

                  {/* Revoke button */}
                  {!isFirst && (
                    <button
                      onClick={() => revokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-950 transition-all disabled:opacity-50"
                    >
                      {revokingId === session.id ? (
                        <LuLoader className="w-4 h-4 animate-spin" />
                      ) : (
                        <LuTrash2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-zinc-600 text-center mt-6">
          Sessions expire after 7 days of inactivity. Revoking a session
          immediately signs out that device.
        </p>
      </main>
    </div>
  );
}

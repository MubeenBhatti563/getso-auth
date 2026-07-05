"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LuShieldCheck,
  LuCheck,
  LuLoader,
  LuCircleAlert,
} from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils/errors";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isMissingToken = !token;

  useEffect(() => {
    if (isMissingToken) return;

    const verify = async () => {
      setStatus("loading");
      try {
        await verifyEmail({ token });
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(getErrorMessage(error));
      }
    };

    verify();
  }, [token, isMissingToken, verifyEmail]);

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

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 text-center">
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuLoader className="w-6 h-6 text-zinc-400 animate-spin" />
              </div>
              <h2 className="text-lg font-medium text-zinc-100 mb-2">
                Verifying your email
              </h2>
              <p className="text-sm text-zinc-500">Please wait a moment...</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-emerald-950 border border-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-medium text-zinc-100 mb-2">
                Email verified
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                Your email has been verified successfully. You can now sign in
                to your account.
              </p>
              <Link href="/login">
                <Button className="w-full">Sign in</Button>
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-950 border border-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <LuCircleAlert className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-lg font-medium text-zinc-100 mb-2">
                Verification failed
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-2">
                {errorMessage}
              </p>
              <p className="text-xs text-zinc-600 mb-6">
                The link may have expired or already been used.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/register">
                  <Button className="w-full">Register again</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

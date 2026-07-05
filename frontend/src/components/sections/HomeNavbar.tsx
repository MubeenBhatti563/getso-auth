"use client";
import Link from "next/link";
import { Button } from "../ui/Button";
import { SiAuthelia } from "react-icons/si";
import { useAuthStore } from "@/store/auth.store";

const Navbar = () => {
  const { user } = useAuthStore();
  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
      <Link className="flex items-center gap-2.5" href="/">
        <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-sm">
          <SiAuthelia />
        </div>
        <span className="font-medium text-zinc-100">Getso Auth</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="#features"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Docs
        </Link>
        <Link
          href="#"
          className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Pricing
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </>
        ) : (
          <Link href="/dashboard">
            <Button size="md">Dashboard</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

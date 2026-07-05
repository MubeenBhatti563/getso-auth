import Link from "next/link";
import { LuShieldCheck } from "react-icons/lu";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <LuShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-zinc-100">Getso Auth</span>
        </div>

        <h1 className="text-6xl font-medium text-zinc-800 mb-4">404</h1>
        <h2 className="text-xl font-medium text-zinc-100 mb-2">
          Page not found
        </h2>
        <p className="text-sm text-zinc-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}

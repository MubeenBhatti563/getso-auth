import Link from "next/link";
import { Button } from "../ui/Button";
import { FaLongArrowAltRight } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="flex flex-col items-center text-center px-6 pt-10 pb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 mb-6">
        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
        JWT · Refresh tokens · RBAC · Email verification
      </div>

      <h1 className="text-4xl md:text-5xl font-medium text-zinc-100 leading-tight tracking-tight mb-5">
        Authentication that <span className="text-violet-400">just works</span>
      </h1>

      <p className="text-base text-zinc-400 leading-relaxed max-w-md mb-8">
        Secure, production-ready auth for modern applications. Built with
        NestJS, Next.js, and Redis.
      </p>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <Link href="/register">
          <Button size="lg" className="flex items-center gap-2 group">
            <span>Create an account</span>
            <FaLongArrowAltRight className="group-hover:translate-x-2 transition-all duration-200 ease-in" />
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg">
            Sign in
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;

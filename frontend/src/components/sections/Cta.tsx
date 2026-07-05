import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";
import { FaLongArrowAltRight } from "react-icons/fa";

const Cta = () => {
  return (
    <section className="text-center px-6 py-12 border-t border-zinc-800">
      <h2 className="text-2xl font-medium text-zinc-100 mb-2">
        Ready to get started?
      </h2>
      <p className="text-sm text-zinc-500 mb-6">
        Create your account in seconds. No credit card required.
      </p>
      <Link href="/register">
        <Button size="lg" className="flex items-center gap-2 group">
          <span>Create an account</span>
          <FaLongArrowAltRight className="group-hover:translate-x-2 transition-all duration-200 ease-in" />
        </Button>
      </Link>
    </section>
  );
};

export default Cta;

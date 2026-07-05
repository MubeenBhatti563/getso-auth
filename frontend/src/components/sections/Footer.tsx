import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 px-8 py-6 flex items-center justify-between">
      <span className="text-xs text-zinc-600">
        © {new Date().getFullYear()} Getso Auth. All rights reserved.
      </span>
      <span className="text-xs text-zinc-600">
        Built with NestJS · Next.js · PostgreSQL · Redis
      </span>
    </footer>
  );
};

export default Footer;

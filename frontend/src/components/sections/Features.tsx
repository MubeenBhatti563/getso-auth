import { features } from "@/constants/features";
import React from "react";
import { CiMail } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { GrRotateLeft } from "react-icons/gr";
import { IoKeyOutline } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { SiAdguard } from "react-icons/si";

const iconMap: Record<string, React.ReactElement> = {
  keys: <IoKeyOutline />,
  email: <CiMail />,
  roleBased: <GoPeople />,
  tokenRotation: <GrRotateLeft />,
  rateLimiting: <SiAdguard />,
  resetPassword: <RiLockPasswordFill />,
};

const Features = () => {
  return (
    <section id="features" className="px-8 pb-16 max-w-4xl mx-auto">
      <h2 className="text-center text-xl font-medium text-zinc-100 mb-8">
        Everything you need
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
          >
            <div className="text-lg mb-3 bg-purple-700 inline-block p-2 rounded-lg">
              {iconMap[feature.icon]}
            </div>
            <h3 className="text-sm font-medium text-zinc-100 mb-2">
              {feature.title}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

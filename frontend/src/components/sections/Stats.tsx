import { stats } from "@/constants/stats";
import React from "react";

const Stats = () => {
  return (
    <section className="grid grid-cols-3 gap-3 px-8 pb-12 max-w-2xl mx-auto">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="text-center py-5 px-4 bg-zinc-900 border border-zinc-800 rounded-xl"
        >
          <div className="text-2xl font-medium text-violet-400 mb-1">
            {stat.value}
          </div>
          <div className="text-xs text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </section>
  );
};

export default Stats;

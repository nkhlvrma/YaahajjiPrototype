import React from "react";

export function SectionDivider() {
  return (
    <div className="relative w-full h-[123px] pointer-events-none z-10 select-none">
      <div
        className="absolute inset-0 bg-repeat-x opacity-100"
        style={{ backgroundImage: "url('/images/pattern-layer-top.svg')" }}
      />
    </div>
  );
}

"use client";

export default function DecorativeAccent() {
  return (
    <div aria-hidden="true" className="pointer-events-none hidden lg:block">
      <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 opacity-20 blur-3xl transform-gpu" />
      <div className="absolute bottom-8 right-8 w-24 h-24 rotate-12 bg-[rgba(227,115,131,0.08)] opacity-80 rounded-xl blur-sm" />
    </div>
  );
}

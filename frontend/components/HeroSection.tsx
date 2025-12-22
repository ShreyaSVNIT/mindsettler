"use client";

import Image from "next/image";

const HeroSection = () => {
  return (
    <section
      className="
        bg-bg-app
        min-h-[85svh]
        flex
        items-start
        
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-[clamp(1rem,4vw,3rem)]
          pt-[clamp(3.5rem,0vw,0rem)]
        "
      >
        <div
          className="
            grid
            items-center
            gap-[clamp(2rem,6vw,5rem)]
            lg:grid-cols-2
          "
        >
          {/* LEFT CONTENT */}
          <div className="max-w-[42ch] space-y-[clamp(1rem,2.5vw,1.75rem)]">
            <p
              className="
                font-body
                uppercase
                tracking-[0.25em]
                text-text-body/60
                text-[clamp(0.65rem,1vw,0.75rem)]
              "
            >
              Online Psycho-Education & Support
            </p>

            <h1
              className="
                font-title
                leading-none
                text-[clamp(2.5rem,6vw,4.8rem)]
              "
            >
              <span className="text-primary">Mind</span>
              <span className="text-text-body">Settler</span>
            </h1>

            <p
              className="
                font-body
                leading-relaxed
                text-text-body/80
                text-[clamp(0.95rem,1.4vw,1.15rem)]
              "
            >
              A sanctuary for psycho-education and emotional well-being —
              offering clarity, compassion, and structured guidance for life’s
              quieter moments.
            </p>

            <button
              className="
                mt-[clamp(0.5rem,1.5vw,1rem)]
                rounded-full
                bg-primary
                px-[clamp(1.75rem,3vw,2.5rem)]
                py-[clamp(0.7rem,1.2vw,0.9rem)]
                font-body
                text-white
                text-[clamp(0.9rem,1.2vw,1.05rem)]
                transition-all
                duration-300
                hover:bg-primary-hover
                shadow-[0_6px_18px_-4px_rgba(229,93,128,0.25)]
              "
            >
              Book Your First Session
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <div
              className="
                relative
                w-full
                max-w-[clamp(260px,40vw,420px)]
                aspect-square
                overflow-hidden
                rounded-[clamp(20px,3vw,32px)]
                bg-bg-card
                shadow-[0_30px_80px_rgba(69,56,89,0.15)]
              "
            >
              <Image
                src="/brain.png"
                alt="Mental wellness illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

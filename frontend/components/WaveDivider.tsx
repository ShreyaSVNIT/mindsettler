// frontend/components/WaveDivider.tsx
const WaveDivider = () => {
  return (
    <div className="relative w-full h-24 md:h-32 lg:h-40 overflow-hidden">
      {/* Top color fade */}
      <div className="
        absolute
        inset-x-0
        top-0
        h-16
        bg-gradient-to-b
        from-bg-app
        to-transparent
        z-10
      " />
      
      {/* Wave SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-bg-app)" />
            <stop offset="100%" stopColor="var(--color-bg-card)" />
          </linearGradient>
        </defs>
        
        <path
          d="
            M 0 40
            C 150 10, 250 80, 400 40
            C 550 0, 650 60, 800 40
            C 950 20, 1050 70, 1200 40
            L 1200 120
            L 0 120
            Z
          "
          fill="url(#waveGradient)"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Subtle secondary wave for depth */}
        <path
          d="
            M 0 50
            C 200 20, 300 90, 500 50
            C 700 10, 800 70, 1000 50
            C 1100 40, 1150 80, 1200 50
            L 1200 120
            L 0 120
            Z
          "
          fill="var(--color-bg-card)"
          fillOpacity="0.4"
          className="transition-all duration-1200 ease-out"
        />
      </svg>
      
      {/* Bottom color fade */}
      <div className="
        absolute
        inset-x-0
        bottom-0
        h-16
        bg-gradient-to-t
        from-bg-card
        to-transparent
        z-10
      " />
      
      {/* Subtle floating particles */}
      <div className="
        absolute
        inset-0
        overflow-hidden
        opacity-30
      ">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
              absolute
              w-1
              h-1
              rounded-full
              bg-primary/20
              animate-pulse
            "
            style={{
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDuration: `${3000 + i * 500}ms`,
              animationDelay: `${i * 200}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaveDivider;
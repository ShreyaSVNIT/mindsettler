const WaveDividerSolid = ({ 
  topColor = "var(--color-bg-subtle)", 
  bottomColor = "var(--color-bg-card)" 
}) => {
  return (
    <div className="relative w-full h-32 md:h-40 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background layer - top color */}
        <path
          d="M0,0 L1440,0 L1440,320 L0,320 Z"
          fill={topColor}
        />
        
        {/* Single smooth wave - bottom color */}
        <path
          d="M0,160 
             C360,100 400,220 720,160 
             C1040,100 1080,220 1440,160
             L1440,320 L0,320 Z"
          fill={bottomColor}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
};

export default WaveDividerSolid;

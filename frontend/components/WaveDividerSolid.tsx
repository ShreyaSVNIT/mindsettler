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
        {/* Background layer */}
        <path
          d="M0,0 L1440,0 L1440,320 L0,320 Z"
          fill={topColor}
        />
        
        {/* Main organic wave */}
        <path
          d="M0,160 
             C180,200 280,120 480,140 
             C680,160 780,100 960,130
             C1140,160 1260,200 1440,160
             L1440,320 L0,320 Z"
          fill={bottomColor}
          className="transition-all duration-1000 ease-in-out"
        />
        
        {/* Layered wave for depth */}
        <path
          d="M0,180 
             C200,220 320,160 520,180 
             C720,200 840,140 1020,170
             C1200,200 1320,240 1440,200
             L1440,320 L0,320 Z"
          fill={bottomColor}
          opacity="0.7"
          className="transition-all duration-1000 ease-in-out"
        />
        
        {/* Accent wave */}
        <path
          d="M0,220 
             C240,260 360,200 560,230 
             C760,260 880,210 1060,240
             C1240,270 1360,300 1440,270
             L1440,320 L0,320 Z"
          fill={bottomColor}
          opacity="0.5"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
    </div>
  );
};

export default WaveDividerSolid;

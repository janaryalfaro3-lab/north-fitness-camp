import React from 'react';

export const Logo: React.FC<{ className?: string; light?: boolean }> = ({ className = "h-12" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-display font-bold leading-none tracking-tighter text-white">
          NORTH FITNESS
        </span>
        <span className="text-[8px] md:text-[10px] font-display font-bold tracking-[0.3em] -mt-1 text-white/70">
          CAMP
        </span>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

const TransformationCard: React.FC<{ name: string; program: string; before: string; after: string }> = ({ name, program, before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(position);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/5] overflow-hidden bg-white border border-gray-100 cursor-col-resize select-none shadow-2xl rounded-3xl"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* After Image */}
        <img 
          src={after} 
          alt={`${name} After`}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Before Image (Clipped) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img 
            src={before} 
            alt={`${name} Before`}
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: `${100 / (sliderPos / 100)}%` }}
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Divider */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-primary z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)]">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-white rounded-full" />
              <div className="w-1 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 text-[10px] font-bold uppercase tracking-widest z-20 rounded-lg shadow-lg text-gray-900">Before</div>
        <div className="absolute bottom-6 right-6 bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white z-20 rounded-lg shadow-lg">After</div>
      </div>
      
      <div className="mt-8 text-center">
        <h4 className="text-2xl font-display font-bold text-gray-900">{name}</h4>
        <p className="text-primary text-sm font-display font-bold uppercase tracking-widest">{program}</p>
      </div>
    </div>
  );
};

export const Results: React.FC = () => {
  const transformations = [
    {
      name: 'Mark Santos',
      program: 'Weight Loss Camp',
      before: 'https://picsum.photos/seed/fitness1/800/1000?grayscale',
      after: 'https://picsum.photos/seed/fitness1/800/1000'
    },
    {
      name: 'Elena Cruz',
      program: 'HIIT Bootcamp',
      before: 'https://picsum.photos/seed/fitness2/800/1000?grayscale',
      after: 'https://picsum.photos/seed/fitness2/800/1000'
    },
    {
      name: 'Juan Dela Cruz',
      program: 'Strength & Conditioning',
      before: 'https://picsum.photos/seed/fitness3/800/1000?grayscale',
      after: 'https://picsum.photos/seed/fitness3/800/1000'
    }
  ];

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-4">REAL RESULTS</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 perspective-1200">
          {transformations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateX: 20, y: 50 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <TransformationCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

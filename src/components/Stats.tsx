import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';

const StatCard: React.FC<{ number: string; label: string }> = ({ number, label }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative bg-secondary/50 backdrop-blur-md p-8 border border-white/10 preserve-3d perspective-1000 shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-2xl group overflow-hidden"
    >
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      <div className="relative z-10">
        <h3 className="text-primary text-6xl font-display font-bold mb-2 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">{number}</h3>
        <p className="text-gray-400 font-display font-bold uppercase tracking-[0.2em] text-xs">{label}</p>
      </div>
    </motion.div>
  );
};

export const Stats: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Members Trained' },
    { number: '5+', label: 'Years Running' },
    { number: '8', label: 'Programs Available' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

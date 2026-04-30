import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Mark Anthony Smith',
    duration: 'Member since 2022',
    text: 'North Fitness Camp changed my life. Sobrang worth it! I lost 15kg in 3 months and built a level of discipline I never thought possible.',
    program: 'Weight Loss Camp',
    initials: 'MS'
  },
  {
    name: 'Jessica Marie Miller',
    duration: 'Member since 2023',
    text: 'The community here is unmatched. Every session is a challenge, but the support from coaches and fellow members keeps me going. Solid talaga!',
    program: 'HIIT Bootcamp',
    initials: 'JM'
  },
  {
    name: 'John David Cruz',
    duration: 'Member since 2021',
    text: 'As an athlete, I needed a place that could push my limits. The Strength & Conditioning program is world-class. Walang katulad dito sa Tarlac.',
    program: 'Strength & Conditioning',
    initials: 'JC'
  },
  {
    name: 'Sarah Jane Wilson',
    duration: 'Member since 2024',
    text: 'I was intimidated at first, but Coach Mike made me feel welcome. Ngayon, I look forward to my 6 AM sessions every day! Super enjoy!',
    program: 'Endurance Training',
    initials: 'SW'
  },
  {
    name: 'Michael James Santos',
    duration: 'Member since 2022',
    text: 'Best fitness investment I have ever made. The results speak for themselves. Grabe yung transformation, mental and physical.',
    program: 'Weight Loss Camp',
    initials: 'MS'
  }
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(2);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">MEMBER <span className="text-primary">STORIES</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        </div>

        <div className="relative h-[550px] flex items-center justify-center perspective-1200">
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {testimonials.map((item, index) => {
              const offset = index - currentIndex;
              const isCenter = index === currentIndex;
              const isLeft = offset === -1 || (currentIndex === 0 && index === testimonials.length - 1);
              const isRight = offset === 1 || (currentIndex === testimonials.length - 1 && index === 0);
              
              let translateX = 0;
              let translateZ = -200;
              let rotateY = 0;
              let scale = 0.8;
              let opacity = 0;
              let zIndex = 0;

              if (isCenter) {
                translateX = 0;
                translateZ = 0;
                rotateY = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
              } else if (isLeft) {
                translateX = -300;
                translateZ = -200;
                rotateY = 35;
                scale = 0.85;
                opacity = 0.6;
                zIndex = 20;
              } else if (isRight) {
                translateX = 300;
                translateZ = -200;
                rotateY = -35;
                scale = 0.85;
                opacity = 0.6;
                zIndex = 20;
              }

              return (
                <motion.div
                  key={index}
                  animate={{ 
                    x: translateX, 
                    z: translateZ, 
                    rotateY: rotateY, 
                    scale: scale,
                    opacity: opacity,
                    zIndex: zIndex
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute w-full max-w-md bg-secondary/80 backdrop-blur-md border border-white/10 p-10 preserve-3d shadow-2xl rounded-3xl group"
                >
                  <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-display font-bold mb-6 shadow-[0_0_15px_rgba(255,0,0,0.3)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.5)] transition-all">
                      {item.initials}
                    </div>
                    
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="#FF0000" color="#FF0000" className="drop-shadow-[0_0_5px_rgba(255,0,0,0.5)]" />
                      ))}
                    </div>
                    
                    <p className="text-lg italic text-gray-400 mb-8 font-medium leading-relaxed">"{item.text}"</p>
                    
                    <div>
                      <h4 className="text-xl font-display font-bold text-white">{item.name}</h4>
                      <p className="text-primary text-[10px] font-display font-bold uppercase tracking-[0.2em] mb-1 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">{item.program}</p>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{item.duration}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6 z-40">
            <button 
              onClick={prev}
              className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={next}
              className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

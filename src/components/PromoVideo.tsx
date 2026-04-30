import React from 'react';
import { motion } from 'motion/react';
import { Play, Shield, Zap, Target } from 'lucide-react';

export const PromoVideo: React.FC = () => {
  return (
    <section id="promo-video" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tight">
              Experience the <span className="text-primary">Camp</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Step inside Tarlac's premier 600sqm powerhouse. Rebranded, reloaded, and engineered for those who demand excellence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-secondary"
          >
            {/* Video Container */}
            <div className="absolute inset-0 z-0">
              {/* Replace the src with your actual video URL */}
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-training-at-the-gym-with-dumbbells-2300-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
            
            {/* Interactive Elements */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-24 h-24 rounded-full bg-primary/90 text-white flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(255,0,0,0.5)] mb-8"
              >
                <Play size={40} fill="currentColor" />
              </motion.div>
              <div className="flex gap-8">
                <div className="flex items-center gap-2 text-white/80">
                  <Shield size={20} className="text-primary" />
                  <span className="font-display font-bold uppercase tracking-widest text-xs">Elite Gear</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Zap size={20} className="text-primary" />
                  <span className="font-display font-bold uppercase tracking-widest text-xs">High Energy</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Target size={20} className="text-primary" />
                  <span className="font-display font-bold uppercase tracking-widest text-xs">Proven Results</span>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary z-20" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary z-20" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Floor Space', val: '600sqm' },
              { label: 'Floors', val: '2 Floors' },
              { label: 'Location', val: 'Tarlac City' },
              { label: 'Status', val: 'RELOADED' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center"
              >
                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-white font-display font-bold text-lg">{stat.val}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

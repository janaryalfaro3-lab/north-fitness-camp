import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const groupClasses = [
  "Calisthenics", "CrossFit", "Bootcamp", "Muay Thai", "Tabata", 
  "Boxercise", "Yoga", "Zumba", "Fit Camp Step", "Circuit Training", 
  "Cardio Martial Arts", "Fitness Abs Workout", "Spinning Class"
];

const facilities = [
  "Hot and Cold Shower", "Dry Sauna", "Lockers", "Top-of-the-Line Equipment", 
  "Group Class Studio", "Free Wi-Fi", "Water Dispensers", "Alcohol Sanitizers", 
  "Fully Air-Conditioned", "Fitness Assessment & BMI Check"
];

export const Amenities: React.FC = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Group Classes */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />
            
            <h3 className="text-3xl font-display font-bold mb-8 text-white flex items-center gap-4">
              <span className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="text-primary" size={24} />
              </span>
              GROUP CLASSES <span className="text-primary">AVAILABLE</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupClasses.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-gray-400 group/item"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover/item:scale-150 transition-transform" />
                  <span className="text-sm font-medium tracking-wide group-hover/item:text-white transition-colors">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Facilities & Amenities */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-primary/10 transition-all duration-700" />

            <h3 className="text-3xl font-display font-bold mb-8 text-white flex items-center gap-4">
              <span className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-primary" size={24} />
              </span>
              FACILITIES & <span className="text-primary">AMENITIES</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-gray-400 group/item"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(255,0,0,0.8)] group-hover/item:scale-150 transition-transform" />
                  <span className="text-sm font-medium tracking-wide group-hover/item:text-white transition-colors">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Target, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: <Target className="text-primary" size={32} />,
    title: "OUR MISSION",
    desc: "To provide a high-octane environment where discipline meets elite training, forging the strongest version of every member."
  },
  {
    icon: <Zap className="text-primary" size={32} />,
    title: "ELITE EQUIPMENT",
    desc: "Equipped with world-class machinery and specialized zones for powerlifting, bodybuilding, and functional fitness."
  },
  {
    icon: <Shield className="text-primary" size={32} />,
    title: "EXPERT COACHING",
    desc: "Our certified coaches bring years of competitive experience to guide you through every rep and every goal."
  },
  {
    icon: <Users className="text-primary" size={32} />,
    title: "COMMUNITY",
    desc: "More than just a gym—we are a camp of like-minded individuals pushing each other towards excellence."
  }
];

export const About: React.FC = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [500, 1500], [0, 200]);

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background Wallpaper */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 z-0 opacity-20 grayscale brightness-50"
      >
        <img 
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075" 
          alt="Gym Interior" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)] uppercase tracking-tighter">
              READY TO <br />
              <span className="text-primary text-shadow-3d">LEVEL UP?</span>
            </h2>
            <div className="w-24 h-1 bg-primary mb-8 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            
            <p className="text-white text-xl mb-8 font-display font-bold leading-relaxed italic">
              "Join us at NORTH FITNESS CAMP — where world-class facilities, expert coaches, and dynamic group classes await!"
            </p>
            <p className="text-gray-400 text-lg mb-8 font-medium leading-relaxed">
              Whether you're a beginner or a fitness enthusiast, we have something for YOU! Established in 2021, North Fitness Camp has quickly become Tarlac's premier destination for serious fitness enthusiasts. Spanning two floors and 600sqm, we offer a space that is both intimidatingly professional and welcomingly supportive.
            </p>
            <p className="text-gray-400 text-lg mb-12 font-medium leading-relaxed">
              Train hard, stay consistent — only at North Fitness Camp! We don't just sell memberships; we build champions.
            </p>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-secondary/50 backdrop-blur-md border border-white/10 rounded-2xl">
                <p className="text-primary text-4xl font-display font-bold mb-1">600+</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Square Meters</p>
              </div>
              <div className="p-6 bg-secondary/50 backdrop-blur-md border border-white/10 rounded-2xl">
                <p className="text-primary text-4xl font-display font-bold mb-1">2</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Floors of Power</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-3xl group hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-white tracking-widest">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

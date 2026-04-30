import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Flame, Dumbbell, Zap, Crown, Star, Shield, Trophy } from 'lucide-react';

const ProgramCard: React.FC<{ 
  title: string; 
  tagline: string; 
  icon: React.ReactNode;
  details: { duration: string; price: string; perks: string[]; isPopular?: boolean }
}> = ({ title, tagline, icon, details }) => {
  return (
    <div className="group h-[450px] [perspective:1000px]">
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className={`absolute inset-0 bg-secondary/80 backdrop-blur-md border ${details.isPopular ? 'border-primary shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'border-white/10'} p-8 flex flex-col items-center justify-center text-center [backface-visibility:hidden] shadow-2xl rounded-3xl group-hover:border-primary/50 transition-colors duration-500`}>
          {details.isPopular && (
            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]">
              BEST VALUE
            </div>
          )}
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          <div className="text-primary mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">{icon}</div>
          <h3 className="text-2xl font-display font-bold mb-2 text-white">{title}</h3>
          <p className="text-gray-400 text-sm font-medium tracking-wide">{tagline}</p>
          <div className="mt-6">
            <p className="text-3xl font-display font-bold text-white">{details.price}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{details.duration}</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl" />
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 bg-secondary border-2 border-primary p-8 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_40px_rgba(255,0,0,0.2)] rounded-3xl">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          <h3 className="text-xl font-display font-bold mb-4 text-primary drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">{title}</h3>
          <div className="space-y-4 mb-8">
            <ul className="text-xs text-gray-300 space-y-3">
              {details.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full py-4 bg-primary text-white font-display font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.3)]">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export const Programs: React.FC = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [1500, 2500], [0, 200]);

  const memberships = [
    {
      title: '1 Month Membership',
      tagline: 'Perfect for starters',
      icon: <Star size={48} />,
      details: {
        duration: '30 Days Access',
        price: '₱2,700',
        perks: ['Full Gym Access', 'Free Assessment', 'Locker Access', 'Student Rate: ₱2,500']
      }
    },
    {
      title: '3 Months Membership',
      tagline: 'Commit to the grind',
      icon: <Shield size={48} />,
      details: {
        duration: '90 Days Access',
        price: '₱5,999',
        perks: ['Full Gym Access', 'Free Assessment', 'Locker Access', 'Priority Support']
      }
    },
    {
      title: '3+1 Month Membership',
      tagline: 'Our most popular plan',
      icon: <Crown size={48} />,
      details: {
        duration: '120 Days Access',
        price: '₱6,999',
        isPopular: true,
        perks: ['Buy 3 Get 1 Free', 'Full Gym Access', 'Free Assessment', 'Locker Access', 'Guest Passes']
      }
    },
    {
      title: 'Long Term (12+4)',
      tagline: 'Ultimate transformation',
      icon: <Trophy size={48} />,
      details: {
        duration: '16 Months Access',
        price: '₱17,999',
        perks: ['Buy 12 Get 4 Free', 'Full Gym Access', 'Free Assessment', 'Locker Access', 'Exclusive Merch']
      }
    }
  ];

  const longTerm = [
    { name: '3+2 Months', price: '₱7,999' },
    { name: '5+4 Months', price: '₱11,999' },
    { name: '12+4 Months', price: '₱17,999' }
  ];

  return (
    <section id="programs" className="py-24 bg-background relative overflow-hidden">
      {/* Background Wallpaper */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 z-0 opacity-20 grayscale brightness-50"
      >
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" 
          alt="Gym Equipment" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)] uppercase tracking-tighter">MEMBERSHIP <span className="text-primary">PLANS</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {memberships.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>

        {/* Long Term Table */}
        <div className="max-w-4xl mx-auto bg-secondary/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
          <h3 className="text-3xl font-display font-bold mb-8 text-white text-center">LONG TERM <span className="text-primary">MEMBERSHIPS</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {longTerm.map((item, i) => (
              <div key={i} className="p-6 bg-black/40 border border-white/10 rounded-2xl text-center hover:border-primary transition-all group/item">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{item.name}</p>
                <p className="text-2xl font-display font-bold text-white group-hover/item:text-primary transition-colors">{item.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Day Pass: ₱500</p>
          </div>
        </div>
      </div>
    </section>
  );
};

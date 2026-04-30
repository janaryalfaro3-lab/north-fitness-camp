import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const CoachCard: React.FC<{ 
  name: string; 
  title: string; 
  tags: string[]; 
  exp: string;
  gender: string;
  image: string;
  offer?: string;
  quote?: string;
  funFact?: string;
}> = ({ name, title, tags, exp, gender, image, offer, quote, funFact }) => {
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
      className="relative bg-zinc-900/40 backdrop-blur-2xl p-8 border border-white/10 preserve-3d perspective-1000 group overflow-hidden shadow-2xl hover:shadow-lime-400/5 transition-all duration-700 rounded-[2.5rem] flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      
      {/* Certified Badge */}
      <div className="absolute top-4 right-[-35px] bg-lime-400 text-black font-display font-black text-[10px] py-1 px-10 rotate-45 shadow-[0_0_15px_rgba(163,230,53,0.5)] z-20">
        CERTIFIED
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-lime-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      <div className="relative z-10 flex flex-col h-full items-center text-center">
        {/* Profile Image Container */}
        <div className="relative mb-6 shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-lime-400/30 group-hover:border-lime-400 transition-all duration-500 shadow-[0_0_20px_rgba(163,230,53,0.1)]">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-lime-400 border border-lime-400 rounded-full shadow-lg">
            <span className="text-black text-[9px] font-black uppercase tracking-[0.2em] font-display whitespace-nowrap">{gender}</span>
          </div>
        </div>
        
        <div className="mb-4 shrink-0">
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-1 text-white group-hover:text-lime-400 transition-colors uppercase tracking-tight">{name}</h3>
          <p className="text-gray-400 text-[10px] md:text-xs font-display font-bold uppercase tracking-[0.3em]">{title}</p>
        </div>

        {quote && (
          <div className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            <p className="text-[11px] text-gray-300 italic font-medium leading-relaxed">"{quote}"</p>
          </div>
        )}
        
        {/* Constant height container for variable text to keep rest of card aligned */}
        <div className="flex-grow flex flex-col items-center justify-center mb-6">
          {funFact && (
            <div className="mb-4 py-2 px-3 bg-zinc-800/50 rounded-xl border border-white/5 w-full">
              <p className="text-[9px] text-lime-400 uppercase font-black tracking-widest mb-1">Fun Fact</p>
              <p className="text-[10px] text-gray-400">{funFact}</p>
            </div>
          )}

          {offer && (
            <div className="mb-4 p-4 bg-lime-400/5 border border-lime-400/10 rounded-2xl max-w-[240px]">
              <p className="text-[10px] text-lime-400/90 font-bold uppercase leading-relaxed tracking-tight">{offer}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[8px] md:text-[9px] px-3 py-1 bg-white/5 border border-white/10 text-gray-400 font-bold uppercase tracking-widest rounded-full group-hover:border-lime-400/30 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom actions pinned to the card base */}
        <div className="mt-auto w-full">
          <a 
            href={`#booking-calendar`}
            className="w-full mb-8 py-4 bg-primary text-white font-display font-bold uppercase text-[10px] md:text-xs tracking-widest text-center hover:bg-white hover:text-primary transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_40px_rgba(255,0,0,0.4)] rounded-2xl flex items-center justify-center gap-2 group/book"
          >
            Book Schedule
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
          
          <div className="w-full pt-6 border-t border-white/10 flex justify-between items-center">
            <div className="text-left">
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Experience</p>
              <p className="text-xl font-black text-white font-display tracking-tight">{exp}</p>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.15)] group-hover:shadow-[0_0_30px_rgba(163,230,53,0.3)] transition-all transform group-hover:scale-110 group-hover:rotate-12">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Coaches: React.FC = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [2500, 3500], [0, 200]);

  const coaches = [
    {
      name: 'Coach Harold',
      title: 'Head Strength Coach',
      tags: ['Weight Loss', 'HIIT', 'Strength'],
      exp: '8+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/616167005_1357308569742292_2269808994999264131_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=5S4gjwcixlEQ7kNvwHfJFnd&_nc_oc=AdopfDTcb35F73n5OxQ-Z63TyS-VepWaWe4lnAV70OhgRuXUxdUqtBS7lCyKoeYZPfs&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=aF8upCJtuXBPADB7ft49yw&_nc_ss=7b2a8&oh=00_Af0r1DTFW2DVQhrQxOzFhRJzct-RSK54nF59uduXB8CwxA&oe=69F924A2',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Strength is not just physical; it\'s the will to never give up on yourself.',
      funFact: 'Can do 50 pull-ups in a single set!'
    },
    {
      name: 'Coach Joeffrey',
      title: 'Conditioning Specialist',
      tags: ['Bodybuilding', 'Conditioning', 'HIIT'],
      exp: '7+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/616584603_1357308566408959_7429159526451463547_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=ryJSzZu_I7QQ7kNvwGi4Frx&_nc_oc=AdpV7X7U3aUBWFbBa9kPAGOzCfI7_HXHq9oqya3gBCptdHhdFgw3NDvWd6_9l3fVYFw&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=jTJON7wmXoSMLJdCGDKzgQ&_nc_ss=7b2a8&oh=00_Af30H_Q4bQVkwg0DBTbceR8Fy9cFJMwRiSWLxFKV2rnDEg&oe=69F9412F',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Consistency beats intensity every single time.',
      funFact: 'Loves ultra-marathons and early morning runs.'
    },
    {
      name: 'Coach Teresa',
      title: 'Fitness & Wellness Coach',
      tags: ['Female Fitness', 'Yoga', 'Weight Loss'],
      exp: '6+ Years',
      gender: 'Female',
      image: 'https://scontent.fmnl17-1.fna.fbcdn.net/v/t39.30808-6/616839272_1357308573075625_7631671944602560753_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=13d280&_nc_ohc=nEDpR1rOozYQ7kNvwHF2Qe1&_nc_oc=AdoykXAXB77zNh8vZydLuZT7OQpZYhX9ruywu1yXaNwHJaXtkUw9cUhGS1r4xf0Bvjg&_nc_zt=23&_nc_ht=scontent.fmnl17-1.fna&_nc_gid=yNlU_GRYMtZA1Ebu43Prfw&_nc_ss=7b2a8&oh=00_Af0sRua79TUijzYEpZxTWEsOJIY92z-SPTkh4srhU1vTSA&oe=69F919FB',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Wellness is a journey of balance and self-love.',
      funFact: 'Practices yoga for over 10 years and loves herbal teas.'
    },
    {
      name: 'Coach Alvin',
      title: 'Powerlifting Expert',
      tags: ['Powerlifting', 'Strength', 'HIIT'],
      exp: '9+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/616803666_1357308656408950_346872988368576245_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=CpGB_qsMKDUQ7kNvwEgxQVk&_nc_oc=Adp_S6dKqZ99Fj4aZt1jOeYtdmZUPt2V1zg19i0pVSt01SsvP1qjdAP6OxTUkB0ptao&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&_nc_gid=1omMXkGyJY2WQRFaQDqXOQ&_nc_ss=7b2a8&oh=00_Af1JC619NxZ6m_KpRldVFLVtruaR4Kzf4tbR6vgL6VX0cQ&oe=69F91E93',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'The only weight that matters is the one you haven\'t lifted yet.',
      funFact: 'National powerlifting record holder in his category.'
    }
  ];

  return (
    <section id="coaches" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Wallpaper with Warm Tint */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 z-0 opacity-10 grayscale brightness-[0.3]"
      >
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" 
          alt="Gym Interior" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)] uppercase tracking-tighter">ELITE <span className="text-primary">COACHES</span></h2>
          <div className="w-24 h-1 bg-primary mx-auto shadow-[0_0_10px_rgba(255,0,0,0.5)] mb-8" />
          <div className="max-w-3xl mx-auto p-6 bg-secondary/30 backdrop-blur-md border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
            <p className="text-white font-display font-bold text-lg mb-2 uppercase tracking-widest">Personal Trainers</p>
            <p className="text-gray-400 text-sm mb-4 italic">(Available with additional fees)</p>
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Certified</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Specializations & Qualifications</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full" /> Years of Experience</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {coaches.map((coach, index) => (
            <CoachCard key={index} {...coach} />
          ))}
        </div>

        {/* PT Pricing Table */}
        <div className="max-w-5xl mx-auto bg-secondary/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
          <h3 className="text-3xl font-display font-bold mb-8 text-white text-center">PERSONAL TRAINER <span className="text-primary">INVESTMENT</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { sessions: '1 Session', price: '₱799', validity: 'Per Session' },
              { sessions: '12 Sessions', price: '₱9,400', validity: 'Valid for 1 Month' },
              { sessions: '20 Sessions', price: '₱12,400', validity: 'Valid for 2 Months' },
              { sessions: '30 Sessions', price: '₱16,400', validity: 'Valid for 3 Months' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-black/40 border border-white/10 rounded-2xl text-center hover:border-lime-400 transition-all group/item">
                <p className="text-lime-400 text-xs font-bold uppercase tracking-widest mb-2">{item.sessions}</p>
                <p className="text-2xl font-display font-bold text-white group-hover/item:text-lime-400 transition-colors">{item.price}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-2">{item.validity}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm italic">"Avail 30 sessions and get Free 1 Month Membership"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

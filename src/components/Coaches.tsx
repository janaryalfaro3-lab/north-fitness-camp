import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, setDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';

interface CoachData {
  id: string;
  name: string; 
  title: string; 
  tags: string[]; 
  exp: string;
  gender: string;
  image: string;
  offer?: string;
  quote?: string;
  funFact?: string;
  order: number;
}

const CoachCard: React.FC<CoachData> = ({ name, title, tags, exp, gender, image, offer, quote, funFact }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [imgSrc, setImgSrc] = useState(image);
  const [hasError, setHasError] = useState(false);

  // Sync image source if prop changes (e.g. after seeding or DB update)
  useEffect(() => {
    setImgSrc(image);
    setHasError(false);
  }, [image]);

  // High-quality fallback images from Unsplash
  const fallbacks: Record<string, string> = {
    'Male': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000',
    'Female': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000'
  };

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
              src={imgSrc} 
              alt={name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${hasError ? 'grayscale' : ''}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={() => {
                if (!hasError) {
                  setImgSrc(fallbacks[gender] || fallbacks['Male']);
                  setHasError(true);
                  console.warn(`Original image for ${name} failed to load. Using fallback.`);
                }
              }}
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
  const [coaches, setCoaches] = useState<CoachData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialCoaches: CoachData[] = [
    {
      id: 'harold',
      name: 'Coach Harold',
      title: 'Head Strength Coach',
      tags: ['Weight Loss', 'HIIT', 'Strength'],
      exp: '8+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-3.fna.fbcdn.net/v/t39.30808-6/641106301_1390215136451635_8039561517910346805_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=106&ccb=1-7&_nc_sid=a934a8&_nc_eui2=AeGI1OcdjtfEbUuchsdoKVhSXBCoA9hGVZVcEKgD2EZVlfBkPm-vKG3b9BrPd1gegJokvZv3s68_yuq7n8uJMZZw&_nc_ohc=FFjzJQvwmyoQ7kNvwFgEyrL&_nc_oc=AdqNHmkUCjTi2IyMg75nXVg8fQeQ2SPaLhLpJ6cfg5btu6fMbvteH2FZOQeUeP5SETI&_nc_zt=23&_nc_ht=scontent.fmnl17-3.fna&_nc_gid=OO4kYHbV_lXLhQ4WCJt6Lg&_nc_ss=7b2a8&oh=00_Af5LQnFHU0DdmZbvxfOtK2jMfkjq86eEx6PRk-eEsI5ctg&oe=6A083FD1',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Strength is not just physical; it\'s the will to never give up on yourself.',
      funFact: 'Can do 50 pull-ups in a single set!',
      order: 1
    },
    {
      id: 'joeffrey',
      name: 'Coach Joeffrey',
      title: 'Conditioning Specialist',
      tags: ['Bodybuilding', 'Conditioning', 'HIIT'],
      exp: '7+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-6.fna.fbcdn.net/v/t39.30808-6/640829610_1390215143118301_6384829654621801427_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=109&ccb=1-7&_nc_sid=a934a8&_nc_eui2=AeF3GaqEh0baGwv51JZk8HDlo9lgaA7A8oij2WBoDsDyiFNaX0ocPj16Zu2PeYSd0cIpR7bTAOTzFCdBCshPO2I0&_nc_ohc=lnsNBpc5EsAQ7kNvwFNHtZd&_nc_oc=AdqKEGjwmiQWTdjoI72M4DUK0iCwAgj3y4PQ03CgewjDH4HHqaWF0Wau_ORR2JSBwbs&_nc_zt=23&_nc_ht=scontent.fmnl17-6.fna&_nc_gid=OO4kYHbV_lXLhQ4WCJt6Lg&_nc_ss=7b2a8&oh=00_Af4u02IYjOo4kBR0bqnmoC2P1pvvBq48AU3I8VPytkYscg&oe=6A083B98',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Consistency beats intensity every single time.',
      funFact: 'Loves ultra-marathons and early morning runs.',
      order: 2
    },
    {
      id: 'there',
      name: 'Coach There',
      title: 'Fitness & Wellness Coach',
      tags: ['Female Fitness', 'Yoga', 'Weight Loss'],
      exp: '6+ Years',
      gender: 'Female',
      image: 'https://scontent.fmnl17-1.fna.fbcdn.net/v/t39.30808-6/639392449_1390215153118300_6311419387162876756_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=100&ccb=1-7&_nc_sid=a934a8&_nc_eui2=AeGZkG-WqfyHYFyV0p-VGYu_j6wJ2BX4iPmPrAnYFfiI-XV7Muv1hFUUGdPgenA1CoyexMbVnRbsV2nelNPZdB7_&_nc_ohc=Ai2NxYPwXrwQ7kNvwFqofPS&_nc_oc=AdpChLqniaucJ8dWUUq4v-IQhqGC2SuYkvBCSGqoEIXR7Quiqc2hBX8H6a7kVwGLht0&_nc_zt=23&_nc_ht=scontent.fmnl17-1.fna&_nc_gid=OO4kYHbV_lXLhQ4WCJt6Lg&_nc_ss=7b2a8&oh=00_Af7qvo5elGgmu96kXds_zJKALnmUYN8jofoajYxjshfQtA&oe=6A08574B',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'Wellness is a journey of balance and self-love.',
      funFact: 'Practices yoga for over 10 years and loves herbal teas.',
      order: 3
    },
    {
      id: 'alvin',
      name: 'Coach Alvin',
      title: 'Powerlifting Expert',
      tags: ['Powerlifting', 'Strength', 'HIIT'],
      exp: '9+ Years',
      gender: 'Male',
      image: 'https://scontent.fmnl17-7.fna.fbcdn.net/v/t39.30808-6/641516604_1390215203118295_2261442574900161777_n.jpg?stp=dst-jpg_s206x206_tt6&_nc_cat=108&ccb=1-7&_nc_sid=a934a8&_nc_eui2=AeEMb-MGtl2WEogam7KU19GYF6kT8H8dYcMXqRPwfx1hw2jAlTvLYKDbRtfrHlTZjebYHKiI6yZMp1ODQxNqG1lu&_nc_ohc=Qa_9CmPCGqIQ7kNvwGcAlVA&_nc_oc=AdoaY-7SI37oZi2VWjUE_mNf__FA29KK_MEMYguGtjK2ulTcIDFROrJPZBMH-8ZLe9I&_nc_zt=23&_nc_ht=scontent.fmnl17-7.fna&_nc_gid=OO4kYHbV_lXLhQ4WCJt6Lg&_nc_ss=7b2a8&oh=00_Af4thIJMMPcrEjnBOFxtIEozYsmzWjbhKtdw1kca5dd-rg&oe=6A085E57',
      offer: 'Get 1 Day Free Trial • Avail 30 sessions and get Free 1 Month Membership',
      quote: 'The only weight that matters is the one you haven\'t lifted yet.',
      funFact: 'National powerlifting record holder in his category.',
      order: 4
    }
  ];

  useEffect(() => {
    const q = query(collection(db, 'coaches'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Collection is empty: Show initial data immediately
        setCoaches(initialCoaches);
        setIsLoading(false);
        
        // Attempt to sync to cloud ONLY if user is authenticated (prevents 403 errors)
        if (auth.currentUser) {
          seedCoaches();
        }
      } else {
        const coachList = snapshot.docs.map(doc => doc.data() as CoachData);
        setCoaches(coachList);
        setIsLoading(false);
      }
    }, (error) => {
      // If list fails (usually wouldn't for read: if true), still show local
      setCoaches(initialCoaches);
      setIsLoading(false);
      console.warn("Could not read from Firestore. Using local fallback.");
    });

    return () => unsubscribe();
  }, []);

  const seedCoaches = async () => {
    if (!auth.currentUser) return;
    
    try {
      // We check if we can write by trying the first one; if it fails, we know we aren't admin
      // and we stop immediately to avoid multiple 403 errors in console.
      console.log("Attempting to sync coach profiles to cloud...");
      const firstCoach = initialCoaches[0];
      await setDoc(doc(db, 'coaches', firstCoach.id), firstCoach);
      
      // If the first one succeeded, proceed with others
      for (let i = 1; i < initialCoaches.length; i++) {
        await setDoc(doc(db, 'coaches', initialCoaches[i].id), initialCoaches[i]);
      }
      console.log("Cloud sync complete.");
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.info("Cloud sync skipped: User does not have admin permissions to modify coach profiles.");
      } else {
        console.error("Cloud sync failed:", error);
      }
    }
  };

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
          {isLoading ? (
            // Skeleton or loading state
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[500px] bg-zinc-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />
            ))
          ) : (
            coaches.map((coach) => (
              <CoachCard key={coach.id} {...coach} />
            ))
          )}
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

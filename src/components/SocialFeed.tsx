import React from 'react';
import { motion } from 'motion/react';
import { Facebook, MessageCircle, ExternalLink, Activity } from 'lucide-react';

export const SocialFeed: React.FC = () => {
  return (
    <section id="social-feed" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-primary animate-pulse" size={18} />
              <span className="text-xs font-display font-black uppercase tracking-[0.3em] text-primary">Live Activity</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tighter">
              SOCIAL <span className="text-primary">PULSE</span>
            </h2>
            <p className="text-gray-400 max-w-xl mt-4 font-display text-sm tracking-wide">
              Stay updated with the latest from North Fitness Camp. Recent posts, success stories, and camp highlights.
            </p>
          </div>
          
          <motion.a
            whileHover={{ x: 5 }}
            href="https://www.facebook.com/thefitnesscamp23"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3 px-6 bg-white/5 border border-white/10 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 group"
          >
            <Facebook size={18} className="text-white group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Visit Our Community</span>
            <ExternalLink size={14} className="text-gray-500" />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed Iframe Container */}
          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl min-h-[600px] overflow-hidden relative group">
            {/* Custom Iframe Overlay for better vibe integration */}
            <div className="absolute inset-0 border-[16px] border-zinc-900/40 pointer-events-none z-10 rounded-[2.5rem]" />
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fthefitnesscamp23&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId" 
              width="100%" 
              height="600" 
              style={{ border: 'none', overflow: 'hidden', padding: '10px' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="grayscale-[0.5] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
            />
          </div>

          {/* Quick Stats/Interaction side panel */}
          <div className="space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-lg group hover:border-primary/30 transition-colors">
              <h4 className="text-sm font-display font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <MessageCircle size={18} className="text-primary" /> Community Buzz
              </h4>
              <div className="space-y-6">
                {[
                  { user: "Sarah M.", msg: "Lost 5kg in 2 months! Thanks Coach Harold!", time: "2h ago" },
                  { user: "Jake R.", msg: "Best gym environment in North!", time: "5h ago" },
                  { user: "Elena P.", msg: "Coach Teresa's yoga sessions are magic.", time: "1d ago" }
                ].map((item, i) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{item.user}</p>
                    <p className="text-xs text-gray-400 italic mb-1 line-clamp-2">"{item.msg}"</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-xl font-display font-bold text-white mb-4 uppercase tracking-tight">JOIN THE <span className="text-primary">MOVEMENT</span></h4>
                <p className="text-xs text-gray-400 mb-6 font-display font-medium tracking-wide">Tag us in your workout stories to get featured & win monthly freebies!</p>
                <div className="flex -space-x-4 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden`}>
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-primary flex items-center justify-center text-[10px] font-black text-white">
                    +2k
                  </div>
                </div>
                <button className="w-full py-4 bg-white text-black font-display font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-primary hover:text-white transition-all duration-500 shadow-xl">
                  #NorthFitnessCamp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

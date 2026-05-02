import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Coaches', href: '#coaches' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#enroll' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="hover:opacity-80 transition-opacity">
          <Logo className="h-10 md:h-12" />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/70 hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            </a>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <a 
              href="#enroll" 
              className="px-8 py-3 bg-primary text-white font-display font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-primary transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_35px_rgba(255,0,0,0.5)] rounded-none relative group overflow-hidden"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            className="text-white p-2 bg-white/5 rounded-lg border border-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 lg:hidden bg-black/95 backdrop-blur-2xl z-[60]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Logo className="h-10" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                  <X size={28} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-10 px-6 flex flex-col gap-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="text-3xl font-display font-bold uppercase tracking-widest text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="p-6 bg-secondary/50 border-t border-white/5 flex flex-col gap-4">
                <a 
                  href="#enroll" 
                  className="w-full py-5 bg-primary text-white font-display font-bold uppercase text-center tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

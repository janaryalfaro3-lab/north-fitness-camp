import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone } from 'lucide-react';

export const PageLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-6xl font-display font-bold tracking-tighter mb-2">NORTH</span>
            <div className="w-12 h-1 bg-primary animate-pulse" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const FloatingActions: React.FC = () => {
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileBar(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/639123456789" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-background shadow-2xl hover:scale-110 transition-transform"
      >
        <MessageCircle size={32} />
      </a>

      {/* Mobile Sticky CTA */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full z-40 bg-secondary border-t border-primary p-4 md:hidden flex gap-4"
          >
            <a 
              href="#enroll" 
              className="flex-1 py-3 bg-primary text-background font-display font-bold uppercase text-center tracking-widest"
            >
              Join Now
            </a>
            <a 
              href="tel:+639123456789" 
              className="w-14 h-14 bg-background border border-primary flex items-center justify-center text-primary"
            >
              <Phone size={24} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
